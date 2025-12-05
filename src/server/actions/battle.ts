'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addXpAndCoins } from './gamification';

import { getAIService } from '@/lib/ai/service';

export async function startBotBattle(topic: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        // Create a new battle record
        const battle = await prisma.battle.create({
            data: {
                player1Id: userId,
                status: 'active',
            },
        });

        // Use AI Service to generate a question
        const aiService = getAIService();
        const questions = await aiService.generateQuestions(topic, 1);
        const question = questions[0];

        // In a real app, we would save the generated question to the DB here
        // For now, we pass the ID (if it exists in our bank) or the whole object

        return { success: true, battleId: battle.id, questionId: question.id };
    } catch (error) {
        console.error('Error starting battle:', error);
        return { success: false, error: 'Failed to start battle.' };
    }
}

export async function finishBotBattle(battleId: string, didWin: boolean) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;

    try {
        const battle = await prisma.battle.update({
            where: { id: battleId },
            data: {
                status: 'completed',
                winnerId: didWin ? userId : 'bot',
            },
        });

        if (didWin) {
            await addXpAndCoins(userId, 50, 20);
        }

        return { success: true, didWin };
    } catch (error) {
        console.error('Error finishing battle:', error);
        return { success: false, error: 'Failed to finish battle.' };
    }
}
