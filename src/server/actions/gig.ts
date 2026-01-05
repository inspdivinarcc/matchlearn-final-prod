'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getGigs() {
    try {
        const gigs = await prisma.gig.findMany({
            where: { status: 'OPEN' },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, gigs };
    } catch (error) {
        console.error('Error fetching gigs:', error);
        return { success: false, error: 'Failed to fetch gigs', gigs: [] };
    }
}

export async function applyForGig(gigId: string) {
    const session = await getServerSession(authOptions);
    // Cast strict type for user id
    const user = session?.user as { id: string } | undefined;

    if (!user || !user.id) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const gig = await prisma.gig.findUnique({ where: { id: gigId } });

        if (!gig) {
            return { success: false, error: 'Gig not found' };
        }

        if (gig.status !== 'OPEN') {
            return { success: false, error: 'Gig is no longer open' };
        }

        // Check if already applied
        const existingApp = await prisma.gigApplication.findUnique({
            where: {
                gigId_userId: {
                    gigId: gigId,
                    userId: user.id
                }
            }
        });

        if (existingApp) {
            return { success: false, error: 'Already applied' };
        }

        // Create application
        await prisma.gigApplication.create({
            data: {
                gigId,
                userId: user.id,
                status: 'ACCEPTED' // Auto-accept for 'Cyberpunk' feel logic
            }
        });

        // Instant Reward Logic (Gamification)
        // In a real app user would submit work. Here we simulate "Instant Contract"
        await prisma.user.update({
            where: { id: user.id },
            data: { coins: { increment: gig.reward } }
        });

        revalidatePath('/trinity');
        revalidatePath('/home');

        return { success: true, message: `Contract Accepted! +${gig.reward} Coins credited.` };

    } catch (error) {
        console.error('Error applying for gig:', error);
        return { success: false, error: 'Failed to apply' };
    }
}
