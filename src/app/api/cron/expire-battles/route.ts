import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * SEC-08: Cron job to expire abandoned battles.
 * Marks battles with status 'active' that are older than 30 minutes as 'expired'.
 * Configured to run every 15 minutes via Vercel Cron.
 *
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(request: Request) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        const result = await prisma.battle.updateMany({
            where: {
                status: 'active',
                createdAt: {
                    lt: thirtyMinutesAgo,
                },
            },
            data: {
                status: 'expired',
            },
        });

        return NextResponse.json({
            success: true,
            expiredCount: result.count,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error expiring battles:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to expire battles.' },
            { status: 500 }
        );
    }
}
