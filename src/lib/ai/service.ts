import OpenAI from 'openai';
import { AIService, Question } from './types';
import { QUESTION_BANK } from '@/lib/questions';

class MockAIService implements AIService {
    async generateQuestions(topic: string, count: number): Promise<Question[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return random questions from the bank
        const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}

class OpenAIService implements AIService {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    async generateQuestions(topic: string, count: number): Promise<Question[]> {
        try {
            const prompt = `
            Generate ${count} multiple-choice questions about "${topic}".
            
            Return ONLY a raw JSON array (no markdown formatting, no code blocks) where each object has this structure:
            {
                "text": "Question text here",
                "options": [
                    { "id": "a", "text": "Option A" },
                    { "id": "b", "text": "Option B" },
                    { "id": "c", "text": "Option C" },
                    { "id": "d", "text": "Option D" }
                ],
                "correctId": "a" // or b, c, d
            }
            `;

            const completion = await this.client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful educational assistant that generates quiz questions." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            });

            const content = completion.choices[0].message.content;
            if (!content) {
                throw new Error("No content received from OpenAI");
            }

            // Clean up potential markdown code blocks if the model ignores "no markdown"
            const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

            const questions = JSON.parse(cleanedContent) as Question[];

            // Assign IDs if missing (though usually not needed for simple display, good for React keys)
            return questions.map((q, i) => ({
                ...q,
                id: q.id || `gen-${Date.now()}-${i}`
            }));

        } catch (error) {
            console.error("Error generating questions with OpenAI:", error);
            // Fallback to mock if API fails
            return new MockAIService().generateQuestions(topic, count);
        }
    }
}

export function getAIService(): AIService {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
        return new OpenAIService(apiKey);
    }
    console.warn("OPENAI_API_KEY not found, using MockAIService");
    return new MockAIService();
}
