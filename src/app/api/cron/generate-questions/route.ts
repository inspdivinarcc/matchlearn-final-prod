import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow 5 minutes for OpenAI API calls

// Simplified subjects and difficulties for generating varied questions
const SUBJECTS = ['Math', 'Science', 'History', 'Technology', 'Logic'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export async function GET(request: Request) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            { success: false, error: 'OpenAI API key not configured' },
            { status: 500 }
        );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let totalGenerated = 0;

    try {
        // Generate batches. E.g., 2 batches of 10 questions to not timeout/overflow tokens
        // Adjust depending on actual API limits. For the prompt context, we generate 20 questions
        // per run to show the principle without massive payload costs, but limit can be adjusted.
        // We will do a loop over a few combinations.

        for (let i = 0; i < 5; i++) {
            const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
            const difficulty = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];

            const prompt = `Generate 10 multiple-choice questions about ${subject} at ${difficulty} difficulty.
Return as a JSON array of objects, where each object has:
- "question": string
- "options": string array of exactly 4 options
- "correctAnswerIndex": integer 0-3
Do not include any explanation, just the raw JSON.`;

            const aiResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert question generator. You must respond with valid JSON arrays only.',
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            const content = aiResponse.choices[0]?.message?.content || "{}";
            let questions: any[] = [];

            try {
                // OpenAI might return it wrapped in an object like { "questions": [...] }
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed)) {
                    questions = parsed;
                } else if (parsed.questions && Array.isArray(parsed.questions)) {
                    questions = parsed.questions;
                }
            } catch (e) {
                console.error('Failed to parse OpenAI response:', content);
                continue;
            }

            for (const q of questions) {
                if (q.question && Array.isArray(q.options) && typeof q.correctAnswerIndex === 'number') {
                    await prisma.questionBank.create({
                        data: {
                            question: q.question,
                            options: JSON.stringify(q.options),
                            correctAnswerIndex: q.correctAnswerIndex,
                            subject,
                            difficulty,
                        }
                    });
                    totalGenerated++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            generatedCount: totalGenerated,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in generate-questions cron:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
