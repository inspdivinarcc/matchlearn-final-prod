import { createWalletClient, http, publicActions, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY as `0x${string}`;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as `0x${string}`;
const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL as string;

// ABI minimal for minting (example)
const nftAbi = parseAbi([
    'function mint(address to, uint256 tokenId, string uri) returns (uint256)',
    'function safeMint(address to, uint256 tokenId, string uri) returns (uint256)',
]);

export async function getBackendWalletClient() {
    if (!WALLET_PRIVATE_KEY || !ALCHEMY_RPC_URL) {
        console.warn("Missing Web3 credentials (WALLET_PRIVATE_KEY or ALCHEMY_RPC_URL). Web3 features will be disabled.");
        return null;
    }

    const account = privateKeyToAccount(WALLET_PRIVATE_KEY);

    const client = createWalletClient({
        account,
        chain: sepolia,
        transport: http(ALCHEMY_RPC_URL),
    }).extend(publicActions);

    return client;
}

export async function mintUserBadge(
    userId: string,
    userWalletAddress: `0x${string}`,
    badgeId: number,
    badgeMetadataUri: string,
) {
    const client = await getBackendWalletClient();
    if (!client || !NFT_CONTRACT_ADDRESS) {
        throw new Error('Web3 not configured.');
    }

    try {
        const { request } = await client.simulateContract({
            address: NFT_CONTRACT_ADDRESS,
            abi: nftAbi,
            functionName: 'safeMint',
            args: [userWalletAddress, BigInt(badgeId), badgeMetadataUri],
        });
        const hash = await client.writeContract(request);
        console.log(`Badge ${badgeId} minted for user ${userId}. Transaction hash: ${hash}`);
        return hash;
    } catch (error) {
        console.error('Error minting badge:', error);
        throw new Error('Failed to mint digital certificate.');
    }
}
