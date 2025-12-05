'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { finishBotBattle } from '@/server/actions/battle';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Trophy, XCircle } from 'lucide-react';
import { getQuestionById, getRandomQuestion } from '@/lib/questions';

export default function ActiveBattlePage({ params }: { params: { battleId: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const questionId = searchParams.get('q');

    const [question, setQuestion] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; didWin: boolean } | null>(null);

    useEffect(() => {
        // Load question
        if (questionId) {
            const q = getQuestionById(questionId);
            setQuestion(q || getRandomQuestion());
        } else {
            setQuestion(getRandomQuestion());
        }
    }, [questionId]);

    useEffect(() => {
        if (timeLeft > 0 && !result && !isSubmitting) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !result && !isSubmitting) {
            handleAnswer(false); // Time's up
        }
    }, [timeLeft, result, isSubmitting]);

    const handleAnswer = async (isCorrect: boolean) => {
        setIsSubmitting(true);
        try {
            const response = await finishBotBattle(params.battleId, isCorrect);
            if (response.success) {
                setResult({ success: true, didWin: isCorrect });
            } else {
                // Handle error
            }
        } catch (error) {
            console.error(error);
        }
        setIsSubmitting(false);
    };

    if (!question) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    if (result) {
        return (
            <div className="container mx-auto p-4 max-w-md space-y-6 text-center pt-20">
                <Card className="border-2 border-indigo-500/20">
                    <CardContent className="pt-6 space-y-4">
                        {result.didWin ? (
                            <>
                                <Trophy className="h-20 w-20 text-yellow-500 mx-auto animate-bounce" />
                                <h2 className="text-2xl font-bold text-green-600">Vitória!</h2>
                                <p>Você ganhou +50 XP e +20 Coins!</p>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-20 w-20 text-red-500 mx-auto" />
                                <h2 className="text-2xl font-bold text-red-600">Derrota</h2>
                                <p>Tente novamente para ganhar recompensas.</p>
                            </>
                        )}
                        <Button onClick={() => router.push('/arena')} className="w-full">
                            Voltar para Arena
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Batalha em Andamento</h1>
                <div className={`text-xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-primary'}`}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
            </div>

            <Progress value={(timeLeft / 30) * 100} className="h-2" />

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{question.text}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {question.options.map((option: any) => (
                        <Button
                            key={option.id}
                            variant={selectedOption === option.id ? "default" : "outline"}
                            className={`w-full justify-start text-left h-auto py-4 ${selectedOption === option.id ? 'bg-indigo-600 hover:bg-indigo-700' : ''
                                }`}
                            onClick={() => setSelectedOption(option.id)}
                            disabled={isSubmitting}
                        >
                            <span className="font-bold mr-2">{option.id.toUpperCase()}.</span>
                            {option.text}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <Button
                className="w-full text-lg py-6"
                disabled={!selectedOption || isSubmitting}
                onClick={() => handleAnswer(selectedOption === question.correctId)}
            >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Confirmar Resposta'}
            </Button>
        </div>
    );
}
