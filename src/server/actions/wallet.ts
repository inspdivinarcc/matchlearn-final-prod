'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createWalletForUser } from '@/lib/wallet-utils';

export async function createInvisibleWallet() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;
    return await createWalletForUser(userId);
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

export async function getWalletBalance() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { coins: true } // Gems removed as not in User model
        });

        // Calculate earnings from transactions if needed, or just return user balance
        // For now, let's return user balance + mock earnings
        return {
            success: true,
            coins: user?.coins || 0,
            gems: 50, // Mock for now if not in DB
            earnings: 1250.00 // Mock USD earnings
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch balance' };
    }
}

export async function getTransactions() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, transactions };
    } catch (error) {
        return { success: false, error: 'Failed to fetch transactions' };
    }
}
