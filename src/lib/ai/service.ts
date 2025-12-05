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
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateQuestions(topic: string, count: number): Promise<Question[]> {
        // TODO: Implement actual OpenAI call
        console.log(`Generating ${count} questions about ${topic} using OpenAI...`);
        return new MockAIService().generateQuestions(topic, count);
    }
}

export function getAIService(): AIService {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
        return new OpenAIService(apiKey);
    }
    return new MockAIService();
}
