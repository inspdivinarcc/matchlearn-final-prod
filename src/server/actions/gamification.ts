'use server';

import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { mintUserBadge, getBackendWalletClient } from '@/lib/web3';
import { getUserWallet } from './wallet';

export async function addXpAndCoins(userId: string, xpAmount: number, coinsAmount: number) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: xpAmount },
                coins: { increment: coinsAmount },
            },
        });

        // Simple level up logic: Level = 1 + floor(XP / 1000)
        const newLevel = 1 + Math.floor(user.xp / 1000);
        if (newLevel > user.level) {
            await prisma.user.update({
                where: { id: userId },
                data: { level: newLevel },
            });

            // Trigger Badge minting for level up
            try {
                const wallet = await getUserWallet();
                if (wallet.success && wallet.address) {
                    // Mint badge for the new level
                    // Using a placeholder URI for now
                    const metadataUri = `https://api.matchlearn.com/metadata/badge/level/${newLevel}`;
                    const txHash = await mintUserBadge(
                        userId,
                        wallet.address as `0x${string}`,
                        newLevel, // Token ID = Level
                        metadataUri
                    );

                    // Add to local inventory
                    // First ensure inventory exists
                    let inventory = await prisma.inventory.findUnique({ where: { userId } });
                    if (!inventory) {
                        inventory = await prisma.inventory.create({ data: { userId } });
                    }

                    await prisma.nFT.create({
                        data: {
                            inventoryId: inventory.id,
                            name: `Level ${newLevel} Badge`,
                            rarity: 'Common',
                            price: 0,
                            tokenId: newLevel,
                        }
                    });

                    console.log(`Minted Level ${newLevel} Badge: ${txHash}`);
                }
            } catch (mintError) {
                console.error('Failed to mint badge on level up:', mintError);
                // Don't fail the whole request if minting fails
            }
        }

        revalidatePath('/home');
        revalidatePath('/inventory');
        return { success: true, newXp: user.xp, newCoins: user.coins, newLevel };
    } catch (error) {
        console.error('Error adding XP/Coins:', error);
        return { success: false, error: 'Failed to update gamification stats.' };
    }
}
