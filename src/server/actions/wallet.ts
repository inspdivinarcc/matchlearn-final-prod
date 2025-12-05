'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export async function createInvisibleWallet() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        // Check if wallet already exists
        const existingWallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (existingWallet) {
            return { success: true, address: existingWallet.address };
        }

        // Generate new random private key and account
        // NOTE: In a real production app, we would encrypt this private key 
        // or use a KMS. For this prototype, we are generating it to get the address
        // but NOT storing the private key in the DB (as per schema). 
        // This means the user cannot sign transactions later unless we store it.
        // For "Invisible Web3" where server mints TO user, address is enough.

        const privateKey = generatePrivateKey();
        const account = privateKeyToAccount(privateKey);
        const address = account.address;

        // Store only the address in the database
        const wallet = await prisma.wallet.create({
            data: {
                userId,
                address,
            },
        });

        return { success: true, address: wallet.address };
    } catch (error) {
        console.error('Error creating invisible wallet:', error);
        return { success: false, error: 'Failed to create wallet.' };
    }
}

export async function getUserWallet() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            return { success: false, error: 'No wallet found' };
        }

        return { success: true, address: wallet.address };
    } catch (error) {
        return { success: false, error: 'Failed to fetch wallet' };
    }
}
