'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getFeedContent() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        // Fetch content that the user hasn't completed yet
        const content = await prisma.content.findMany({
            where: {
                progress: {
                    none: {
                        userId: session.user.id,
                        completed: true,
                    },
                },
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: content };
    } catch (error) {
        console.error('Error fetching feed:', error);
        return { success: false, error: 'Failed to fetch feed content.' };
    }
}
