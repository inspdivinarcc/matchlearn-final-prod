import { NextResponse } from 'next/server';
import { createWalletClient, encodeFunctionData, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const abi = parseAbi([
  'function mintTo(address to, string tokenURI) external returns (uint256)'
]);

export async function POST(req: Request){
  const { to, tokenURI } = await req.json();
  if(!to || !tokenURI) return NextResponse.json({ error:'missing params' }, { status:400 });

  const account = privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY}` as `0x${string}`);
  const client = createWalletClient({ account, chain: sepolia, transport: http(process.env.ALCHEMY_RPC_URL) });

  try{
    const hash = await client.sendTransaction({
      to: process.env.NFT_CONTRACT_ADDRESS as `0x${string}`,
      data: encodeFunctionData({ abi, functionName:'mintTo', args:[to, tokenURI] }),
    });
    return NextResponse.json({ ok:true, hash });
  }catch(e:any){
    return NextResponse.json({ error:e.message }, { status:500 });
  }
}
