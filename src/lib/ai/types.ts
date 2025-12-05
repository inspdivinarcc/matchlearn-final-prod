export interface QuestionOption {
    id: string;
    text: string;
}

export interface Question {
    id?: string;
    text: string;
    options: QuestionOption[];
    correctId: string;
}

export interface AIService {
    generateQuestions(topic: string, count: number): Promise<Question[]>;
}
