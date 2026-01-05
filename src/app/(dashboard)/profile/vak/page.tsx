'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { submitVAKTest } from '@/server/actions/neural-match';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, Ear, Hand, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
    {
        question: "Quando você aprende algo novo, você prefere:",
        options: [
            { text: "Ver diagramas, gráficos e imagens.", type: 'visual', icon: Eye },
            { text: "Ouvir explicações e podcasts.", type: 'auditory', icon: Ear },
            { text: "Colocar a mão na massa e praticar.", type: 'kinesthetic', icon: Hand },
        ]
    },
    {
        question: "Em uma aula de programação, o que mais te ajuda?",
        options: [
            { text: "Ver o código colorido na tela.", type: 'visual', icon: Eye },
            { text: "O professor explicando a lógica.", type: 'auditory', icon: Ear },
            { text: "Digitar o código junto com o professor.", type: 'kinesthetic', icon: Hand },
        ]
    },
    {
        question: "Quando você tem um problema no código:",
        options: [
            { text: "Visualizo a estrutura do erro na minha mente.", type: 'visual', icon: Eye },
            { text: "Explico o problema em voz alta (Rubber Ducking).", type: 'auditory', icon: Ear },
            { text: "Começo a mudar linhas e testar.", type: 'kinesthetic', icon: Hand },
        ]
    }
];

export default function VAKTestPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scores, setScores] = useState({ visual: 0, auditory: 0, kinesthetic: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleAnswer = async (type: 'visual' | 'auditory' | 'kinesthetic') => {
        const newScores = { ...scores, [type]: scores[type] + 1 };
        setScores(newScores);

        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Finish test
            setIsSubmitting(true);
            const total = QUESTIONS.length;
            const vScore = Math.round((newScores.visual / total) * 100);
            const aScore = Math.round((newScores.auditory / total) * 100);
            const kScore = Math.round((newScores.kinesthetic / total) * 100);

            const result = await submitVAKTest(vScore, aScore, kScore);

            if (result.success) {
                toast.success(`Perfil ${result.style} identificado!`);
                router.push('/match/neural');
            } else {
                toast.error('Erro ao salvar perfil.');
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl min-h-[80vh] flex flex-col justify-center">
            <Card className="border-none shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                        <Brain className="w-8 h-8 text-indigo-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Teste de Perfil Neural</CardTitle>
                    <p className="text-slate-400">Descubra como seu cérebro aprende melhor.</p>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="mb-8">
                        <Progress value={((currentQuestion) / QUESTIONS.length) * 100} className="h-2 bg-slate-700" />
                        <p className="text-right text-xs text-slate-400 mt-2">
                            Pergunta {currentQuestion + 1} de {QUESTIONS.length}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-medium text-center mb-8">
                                {QUESTIONS[currentQuestion].question}
                            </h2>

                            <div className="grid gap-4">
                                {QUESTIONS[currentQuestion].options.map((option, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outline"
                                        className="h-auto py-6 px-6 justify-start text-left bg-slate-800/50 border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all group"
                                        onClick={() => handleAnswer(option.type as any)}
                                        disabled={isSubmitting}
                                    >
                                        <div className="p-2 rounded-lg bg-slate-700 group-hover:bg-indigo-500 mr-4 transition-colors">
                                            <option.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-lg">{option.text}</span>
                                        <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}
