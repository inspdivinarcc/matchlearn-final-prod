'use server';

import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { mintUserBadge, getBackendWalletClient } from '@/lib/web3';
import { getUserWallet } from './wallet';
import { AppError, logErrorToSentry, formatErrorForUser } from '@/lib/errors';
import { trackEvent } from '@/lib/analytics';

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

            trackEvent('level_up', { userId, newLevel });

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
                    trackEvent('nft_minted', { badgeType: `level_${newLevel}_badge`, success: true });
                }
            } catch (mintError) {
                console.error('Failed to mint badge on level up:', mintError);
                trackEvent('nft_minted', { badgeType: `level_${newLevel}_badge`, success: false });

                // Save to PendingMint instead of failing silently
                await prisma.pendingMint.create({
                    data: {
                        userId,
                        badgeType: `level_${newLevel}_badge`, // Using standard format
                        error: mintError instanceof Error ? mintError.message : String(mintError),
                    }
                });
                // Don't fail the whole request
            }
        }

        revalidatePath('/home');
        revalidatePath('/inventory');
        return { success: true, newXp: user.xp, newCoins: user.coins, newLevel };
    } catch (error) {
        logErrorToSentry(error, { context: 'addXpAndCoins', userId, xpAmount, coinsAmount });
        return { success: false, error: formatErrorForUser(new AppError('INTERNAL_ERROR')) };
    }
}
