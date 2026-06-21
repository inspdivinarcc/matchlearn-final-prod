import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mintUserBadge } from '@/lib/web3';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const pendingMints = await prisma.pendingMint.findMany({
            where: {
                status: 'pending',
                attempts: { lt: 3 }
            }
        });

        let succeeded = 0;
        let failed = 0;

        for (const mint of pendingMints) {
            try {
                // Determine new level from badgeType (e.g. 'level_10_badge')
                const match = mint.badgeType.match(/level_(\d+)_badge/);
                const newLevel = match ? parseInt(match[1]) : 1;

                // get user wallet
                const wallet = await prisma.wallet.findUnique({ where: { userId: mint.userId } });

                if (wallet && wallet.address) {
                    const metadataUri = `https://api.matchlearn.com/metadata/badge/level/${newLevel}`;
                    await mintUserBadge(
                        mint.userId,
                        wallet.address as `0x${string}`,
                        newLevel,
                        metadataUri
                    );

                    let inventory = await prisma.inventory.findUnique({ where: { userId: mint.userId } });
                    if (!inventory) {
                        inventory = await prisma.inventory.create({ data: { userId: mint.userId } });
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

                    // Mark as completed
                    await prisma.pendingMint.update({
                        where: { id: mint.id },
                        data: { status: 'completed' }
                    });

                    succeeded++;
                } else {
                    throw new Error('User wallet not found');
                }
            } catch (error) {
                console.error(`Retry mint failed for ${mint.id}:`, error);
                const newAttempts = mint.attempts + 1;
                await prisma.pendingMint.update({
                    where: { id: mint.id },
                    data: {
                        attempts: newAttempts,
                        status: newAttempts >= 3 ? 'failed' : 'pending',
                        error: error instanceof Error ? error.message : String(error)
                    }
                });
                failed++;
            }
        }

        const pendingCount = await prisma.pendingMint.count({
            where: { status: 'pending', attempts: { lt: 3 } }
        });

        return NextResponse.json({
            success: true,
            succeeded,
            failed,
            pending: pendingCount,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in retry-mints cron:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
