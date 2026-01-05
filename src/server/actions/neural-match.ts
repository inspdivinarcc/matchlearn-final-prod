'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitVAKTest(visual: number, auditory: number, kinesthetic: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    // Determine dominant style
    let style = 'VISUAL';
    if (auditory > visual && auditory > kinesthetic) style = 'AUDITORY';
    if (kinesthetic > visual && kinesthetic > auditory) style = 'KINESTHETIC';

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                vakVisual: visual,
                vakAuditory: auditory,
                vakKinesthetic: kinesthetic,
                learningStyle: style,
            }
        });

        revalidatePath('/profile');
        return { success: true, style };
    } catch (error) {
        console.error('Error saving VAK results:', error);
        return { success: false, error: 'Failed to save results' };
    }
}

export async function getNeuralMatches() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const currentUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!currentUser?.learningStyle) {
            return { success: false, error: 'No VAK profile found' };
        }

        // Neural Match Logic: Find mentors with complementary or similar styles
        // For now, let's find mentors with the SAME style (affinity)
        const matches = await prisma.user.findMany({
            where: {
                id: { not: userId },
                learningStyle: currentUser.learningStyle,
                // In real app, filter by 'mentor' role
            },
            take: 5,
            select: {
                id: true,
                username: true,
                image: true,
                bio: true,
                learningStyle: true,
                level: true,
            }
        });

        return { success: true, matches, userStyle: currentUser.learningStyle };
    } catch (error) {
        console.error('Error fetching neural matches:', error);
        return { success: false, error: 'Failed to fetch matches' };
    }
}
