'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createProject(name: string, description: string, tags: string[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const project = await prisma.project.create({
            data: {
                name,
                description,
                tags: JSON.stringify(tags),
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: 'owner',
                    },
                },
            },
        });

        revalidatePath('/match');
        return { success: true, project };
    } catch (error) {
        console.error('Error creating project:', error);
        return { success: false, error: 'Failed to create project' };
    }
}

export async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        return projects.map(p => ({
            ...p,
            tags: JSON.parse(p.tags) as string[],
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

export async function joinProject(projectId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        // Check if already a member
        const existingMember = await prisma.teamMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
        });

        if (existingMember) {
            return { success: false, error: 'Already a member' };
        }

        await prisma.teamMember.create({
            data: {
                projectId,
                userId,
                role: 'member', // Could be 'pending' in a real app
            },
        });

        revalidatePath('/match');
        return { success: true };
    } catch (error) {
        console.error('Error joining project:', error);
        return { success: false, error: 'Failed to join project' };
    }
}
