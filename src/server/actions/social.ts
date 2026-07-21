'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createPost(content: string, imageUrl?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const post = await prisma.post.create({
            data: {
                content,
                imageUrl,
                authorId: userId,
            },
        });

        revalidatePath('/social');
        return { success: true, post };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: 'Failed to create post' };
    }
}

export async function getFeed() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                        level: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
                likes: {
                    select: {
                        userId: true
                    }
                }
            },
        });

        return posts;
    } catch (error) {
        console.error('Error fetching feed:', error);
        return [];
    }
}

export async function toggleLike(postId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id },
            });
        } else {
            await prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            });
        }

        revalidatePath('/social');
        return { success: true };
    } catch (error) {
        console.error('Error toggling like:', error);
        return { success: false, error: 'Failed to toggle like' };
    }
}

export async function createStory(content: string, imageUrl?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        // Expirar em 24h
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const story = await prisma.story.create({
            data: {
                content: content || null,
                imageUrl: imageUrl || null,
                authorId: userId,
                expiresAt,
            },
        });

        revalidatePath('/social');
        return { success: true, story };
    } catch (error) {
        console.error('Error creating story:', error);
        return { success: false, error: 'Failed to create story' };
    }
}

export async function getStories() {
    try {
        const now = new Date();
        const stories = await prisma.story.findMany({
            where: {
                expiresAt: {
                    gt: now,
                },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    },
                },
            },
        });

        return stories;
    } catch (error) {
        console.error('Error fetching stories:', error);
        return [];
    }
}
