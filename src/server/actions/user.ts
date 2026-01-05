'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateUserBio(bio: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { bio }
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Error updating bio:', error);
        return { success: false, error: 'Failed to update bio' };
    }
}

export async function getUserProfile() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                image: true,
                bio: true,
                level: true,
                xp: true,
                coins: true,
                vakVisual: true,
                vakAuditory: true,
                vakKinesthetic: true,
                learningStyle: true,
                createdAt: true,
            }
        });

        return { success: true, user };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return { success: false, error: 'Failed to fetch profile' };
    }
}
