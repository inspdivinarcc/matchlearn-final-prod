'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addXpAndCoins } from './gamification';
import { z } from 'zod';
import { QUESTION_BANK } from '@/lib/questions';
import { battleRateLimiter, checkRateLimit } from '@/lib/rate-limit';
import { AppError, logErrorToSentry, formatErrorForUser } from '@/lib/errors';
import { trackEvent } from '@/lib/analytics';

// --- Zod Schemas ---
const startBattleSchema = z.object({
    topic: z.string().min(1).max(200),
});

const submitAnswerSchema = z.object({
    battleId: z.string().min(1),
    answerId: z.string().min(1).max(10),
});

/**
 * Starts a new bot battle.
 * Server selects a random question, saves the correct answer in the DB,
 * and returns ONLY the question text + options (NO correct answer).
 * Rate limited: max 10 battles per hour per user (SEC-03).
 */
export async function startBotBattle(topic: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: formatErrorForUser(new AppError('UNAUTHORIZED')) };
    }

    const parsed = startBattleSchema.safeParse({ topic });
    if (!parsed.success) {
        return { success: false, error: formatErrorForUser(new AppError('INVALID_INPUT')) };
    }

    const userId = (session.user as any).id;

    // SEC-03: Rate limit — max 10 battles per hour per user
    const rateCheck = await checkRateLimit(battleRateLimiter, `battle:${userId}`);
    if (!rateCheck.allowed) {
        const err = new AppError('RATE_LIMIT_EXCEEDED', { retryAfter: rateCheck.retryAfter });
        return { success: false, error: formatErrorForUser(err) };
    }

    try {
        let selectedQuestion: any = null;

        // 1. Try to get a question from the DB QuestionBank
        // Fetch up to 20 least used questions for the topic (or any if topic is broader)
        const pool = await prisma.questionBank.findMany({
            where: { timesUsed: { lt: 50 } }, // Ignore overused questions
            take: 20,
            orderBy: { timesUsed: 'asc' }
        });

        if (pool.length > 0) {
            // Pick a random one from the fetched pool
            const randomDbQuestion = pool[Math.floor(Math.random() * pool.length)];

            // Increment timesUsed
            await prisma.questionBank.update({
                where: { id: randomDbQuestion.id },
                data: { timesUsed: { increment: 1 } }
            });

            // Parse options correctly
            let parsedOptions = [];
            try {
                parsedOptions = JSON.parse(randomDbQuestion.options);
            } catch (e) {
                parsedOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
            }

            selectedQuestion = {
                id: randomDbQuestion.id,
                text: randomDbQuestion.question,
                options: parsedOptions.map((opt: string, i: number) => ({ id: `opt${i}`, text: String(opt) })),
                correctId: `opt${randomDbQuestion.correctAnswerIndex}`
            };
        }

        // 2. FALLBACK: Use static QUESTION_BANK if DB is empty
        if (!selectedQuestion) {
            selectedQuestion = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
        }

        // Create battle record WITH the correct answer stored server-side
        const battle = await prisma.battle.create({
            data: {
                player1Id: userId,
                status: 'active',
                questionId: selectedQuestion.id,
                correctAnswerId: selectedQuestion.correctId,
            },
        });

        trackEvent('battle_started', { battleId: battle.id });

        // Return question WITHOUT the correct answer
        return {
            success: true,
            battleId: battle.id,
            question: {
                id: selectedQuestion.id,
                text: selectedQuestion.text,
                options: selectedQuestion.options.map((o: any) => ({ id: o.id, text: o.text })),
                // NOTE: correctId is NOT sent to the client
            },
        };
    } catch (error) {
        logErrorToSentry(error, { context: 'startBotBattle', userId });
        return { success: false, error: formatErrorForUser(new AppError('INTERNAL_ERROR')) };
    }
}

/**
 * Submits the user's answer for a battle.
 * Server validates the answer against the stored correct answer.
 * The client NEVER knows the correct answer until after submission.
 */
export async function submitBattleAnswer(battleId: string, answerId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: formatErrorForUser(new AppError('UNAUTHORIZED')) };
    }

    const parsed = submitAnswerSchema.safeParse({ battleId, answerId });
    if (!parsed.success) {
        return { success: false, error: formatErrorForUser(new AppError('INVALID_INPUT')) };
    }

    const userId = (session.user as any).id;

    try {
        // Fetch the battle — MUST belong to this user (IDOR protection, SEC-12)
        const battle = await prisma.battle.findFirst({
            where: {
                id: battleId,
                player1Id: userId,  // Only owner can submit
                status: 'active',   // Can only answer active battles
            },
        });

        if (!battle) {
            return { success: false, error: formatErrorForUser(new AppError('BATTLE_NOT_FOUND')) };
        }

        if (!battle.correctAnswerId) {
            return { success: false, error: formatErrorForUser(new AppError('INTERNAL_ERROR', { reason: 'Data corrupted' })) };
        }

        // SERVER validates the answer
        const isCorrect = answerId === battle.correctAnswerId;

        // Update battle with result
        await prisma.battle.update({
            where: { id: battleId },
            data: {
                status: 'completed',
                winnerId: isCorrect ? userId : 'bot',
                answerId: answerId,
            },
        });

        // Reward if correct
        if (isCorrect) {
            await addXpAndCoins(userId, 50, 20);
        }

        trackEvent('battle_completed', {
            battleId,
            result: isCorrect ? 'win' : 'loss',
            xpEarned: isCorrect ? 50 : 0,
            coinsEarned: isCorrect ? 20 : 0
        });

        return {
            success: true,
            isCorrect,
            correctAnswerId: battle.correctAnswerId, // Reveal after submission
            xpGained: isCorrect ? 50 : 0,
            coinsGained: isCorrect ? 20 : 0,
        };
    } catch (error) {
        logErrorToSentry(error, { context: 'submitBattleAnswer', battleId, userId });
        return { success: false, error: formatErrorForUser(new AppError('INTERNAL_ERROR')) };
    }
}
