'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { finishBotBattle } from '@/server/actions/battle';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Trophy, XCircle, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getQuestionById, getRandomQuestion } from '@/lib/questions';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { use } from 'react';

export default function ActiveBattlePage({ params }: { params: Promise<{ battleId: string }> }) {
    const { battleId } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const questionId = searchParams.get('q');

    const [question, setQuestion] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; didWin: boolean } | null>(null);

    // Load question
    useEffect(() => {
        if (questionId) {
            const q = getQuestionById(questionId);
            setQuestion(q || getRandomQuestion());
        } else {
            setQuestion(getRandomQuestion());
        }
    }, [questionId]);

    // Handle answer submission
    const handleAnswer = useCallback(async (isCorrect: boolean) => {
        setIsSubmitting(true);
        try {
            const response = await finishBotBattle(battleId, isCorrect);
            if (response.success) {
                setResult({ success: true, didWin: isCorrect });
                if (isCorrect) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            } else {
                // Handle error (maybe show a toast)
                console.error("Battle finish failed");
            }
        } catch (error) {
            console.error(error);
        }
        setIsSubmitting(false);
    }, [battleId]);

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0 && !result && !isSubmitting && question) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !result && !isSubmitting && question) {
            handleAnswer(false); // Time's up
        }
    }, [timeLeft, result, isSubmitting, question, handleAnswer]);


    if (!question) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-muted-foreground animate-pulse">Invocando desafio...</p>
        </div>
    );

    if (result) {
        return (
            <div className="container mx-auto p-4 max-w-md min-h-[60vh] flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-full"
                >
                    <Card className={`border-2 ${result.didWin ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'} backdrop-blur-xl`}>
                        <CardContent className="pt-10 pb-8 space-y-6 text-center">
                            {result.didWin ? (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
                                        <Trophy className="h-24 w-24 text-yellow-400 mx-auto relative z-10 drop-shadow-lg animate-bounce" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-green-500 tracking-tight">VITÓRIA!</h2>
                                        <p className="text-green-200/80 text-lg">Você dominou este desafio.</p>
                                    </div>
                                    <div className="flex justify-center gap-4 py-4">
                                        <div className="bg-black/20 p-3 rounded-xl min-w-[80px]">
                                            <div className="text-xs text-green-300 uppercase font-bold">XP</div>
                                            <div className="text-2xl font-bold text-white">+50</div>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-xl min-w-[80px]">
                                            <div className="text-xs text-yellow-300 uppercase font-bold">Coins</div>
                                            <div className="text-2xl font-bold text-white">+20</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-24 w-24 text-red-500 mx-auto drop-shadow-lg" />
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-red-500 tracking-tight">DERROTA</h2>
                                        <p className="text-red-200/80 text-lg">O conhecimento vem da falha.</p>
                                    </div>
                                </>
                            )}
                            <Button
                                onClick={() => router.push('/arena')}
                                className={`w-full py-6 text-lg font-bold shadow-lg ${result.didWin ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                            >
                                Voltar para Arena
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl space-y-8 py-10">
            {/* Header / Timer */}
            <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Clock className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Tempo Restante</span>
                        <span className={`text-2xl font-mono font-black ${timeLeft < 10 ? 'text-red-500' : 'text-foreground'}`}>
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </span>
                    </div>
                </div>
                <div className="w-1/3">
                    <Progress value={(timeLeft / 30) * 100} className={`h-3 ${timeLeft < 10 ? 'bg-red-950/30' : 'bg-indigo-950/30'}`} />
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-background shadow-2xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    <CardHeader className="pb-8">
                        <CardTitle className="text-2xl md:text-3xl font-bold leading-tight text-center">
                            {question.text}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-8">
                        <div className="grid gap-4">
                            {question.options.map((option: any, index: number) => (
                                <motion.button
                                    key={option.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setSelectedOption(option.id)}
                                    disabled={isSubmitting}
                                    className={`
                                        relative group w-full text-left p-6 rounded-xl border-2 transition-all duration-200
                                        ${selectedOption === option.id
                                            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                            : 'border-muted hover:border-indigo-500/50 hover:bg-muted/50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-colors
                                            ${selectedOption === option.id ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground group-hover:bg-indigo-500/20 group-hover:text-indigo-500'}
                                        `}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className={`text-lg font-medium ${selectedOption === option.id ? 'text-indigo-400' : 'text-foreground'}`}>
                                            {option.text}
                                        </span>
                                        {selectedOption === option.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="ml-auto"
                                            >
                                                <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Action Button */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Button
                    className={`
                        w-full py-8 text-xl font-bold rounded-xl shadow-xl transition-all
                        ${!selectedOption || isSubmitting
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:scale-[1.02] hover:shadow-indigo-500/25'
                        }
                    `}
                    disabled={!selectedOption || isSubmitting}
                    onClick={() => handleAnswer(selectedOption === question.correctId)}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin mr-3 h-6 w-6" />
                            Processando...
                        </>
                    ) : (
                        <>
                            Confirmar Resposta <ArrowRight className="ml-3 h-6 w-6" />
                        </>
                    )}
                </Button>
            </motion.div>
        </div>
    );
}
