'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function requestFlashSolve(topic: string, description: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    // In a real app, this would broadcast to available mentors
    // For now, we'll simulate finding a mentor

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Find a random mentor (or bot)
    const mentor = await prisma.user.findFirst({
        where: {
            id: { not: userId },
            // In real app, check for 'mentor' role or tags
        }
    });

    if (!mentor) {
        return { success: false, error: 'No mentors available' };
    }

    try {
        const newSession = await prisma.mentorshipSession.create({
            data: {
                studentId: userId,
                mentorId: mentor.id,
                status: 'PENDING',
                cost: 50.0,
            },
            include: {
                mentor: {
                    select: {
                        username: true,
                        image: true,
                    }
                }
            }
        });

        return { success: true, session: newSession };
    } catch (error) {
        console.error('Error requesting flash solve:', error);
        return { success: false, error: 'Failed to request session' };
    }
}
