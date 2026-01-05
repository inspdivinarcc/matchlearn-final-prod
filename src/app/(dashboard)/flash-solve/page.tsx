'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Video, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { requestFlashSolve } from '@/server/actions/flash-solve';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashSolvePage() {
    const [step, setStep] = useState<'request' | 'searching' | 'matched'>('request');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [mentor, setMentor] = useState<any>(null);

    const handleRequest = async () => {
        if (!topic || !description) {
            toast.error('Preencha todos os campos!');
            return;
        }

        setStep('searching');

        // Call server action
        const result = await requestFlashSolve(topic, description);

        if (result.success) {
            setMentor(result.session?.mentor);
            setStep('matched');
            toast.success('Mentor encontrado!');
        } else {
            setStep('request');
            toast.error(result.error || 'Nenhum mentor disponível no momento.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-xl min-h-[80vh] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {step === 'request' && (
                    <motion.div
                        key="request"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <Card className="border-2 border-yellow-400 shadow-2xl shadow-yellow-400/20">
                            <CardContent className="p-8 space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Zap className="w-8 h-8 text-yellow-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900">Flash Solve</h1>
                                    <p className="text-slate-500">Mentoria instantânea para desbloquear seu código.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="font-medium">Qual o tópico?</label>
                                        <Input
                                            placeholder="Ex: Erro no useEffect, Configuração do Docker..."
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium">Descreva o problema</label>
                                        <Textarea
                                            placeholder="Cole o erro ou descreva o que está acontecendo..."
                                            className="min-h-[100px]"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock className="w-4 h-4" /> Tempo estimado: 2 min
                                    </div>
                                    <div className="font-bold text-slate-900">
                                        Preço fixo: 50 Coins
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg h-14"
                                    onClick={handleRequest}
                                >
                                    <Zap className="w-5 h-5 mr-2 fill-current" /> Solicitar Ajuda Agora
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 'searching' && (
                    <motion.div
                        key="searching"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-6"
                    >
                        <div className="relative w-32 h-32 mx-auto">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap className="w-10 h-10 text-yellow-500 animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Buscando Mentor...</h2>
                            <p className="text-slate-500">Conectando com especialistas em {topic}</p>
                        </div>
                    </motion.div>
                )}

                {step === 'matched' && (
                    <motion.div
                        key="matched"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <Card className="border-green-500 border-2 shadow-2xl shadow-green-500/20 overflow-hidden">
                            <div className="bg-green-500 p-4 text-white font-bold flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-6 h-6" /> Mentor Encontrado!
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto overflow-hidden border-4 border-white shadow-lg">
                                    <img
                                        src={mentor?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor?.username}`}
                                        alt="Mentor"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{mentor?.username}</h2>
                                    <p className="text-green-600 font-medium">Senior Developer</p>
                                    <div className="flex justify-center gap-1 mt-2">
                                        {'⭐'.repeat(5)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-12" onClick={() => setStep('request')}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="h-12 bg-green-600 hover:bg-green-700 text-white gap-2"
                                        onClick={() => window.open(`https://meet.jit.si/matchlearn-${Math.random().toString(36).substring(7)}`, '_blank')}
                                    >
                                        <Video className="w-5 h-5" /> Iniciar Call
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
