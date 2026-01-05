'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getNeuralMatches } from '@/server/actions/neural-match';
import { motion } from 'framer-motion';
import { Brain, Sparkles, UserPlus, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function NeuralMatchPage() {
    const [matches, setMatches] = useState<any[]>([]);
    const [userStyle, setUserStyle] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const result = await getNeuralMatches();
            if (result.success) {
                setMatches(result.matches || []);
                setUserStyle(result.userStyle || '');
            }
            setIsLoading(false);
        }
        load();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Carregando seus matches neurais...</div>;
    }

    if (!userStyle) {
        return (
            <div className="container mx-auto p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="w-12 h-12 text-slate-400" />
                </div>
                <h1 className="text-3xl font-bold">Perfil Neural Não Detectado</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Para usar o Neural Match, precisamos entender como seu cérebro aprende.
                </p>
                <Link href="/profile/vak">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Fazer Teste VAK Agora
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-300" /> Neural Match
                    </h1>
                    <p className="mt-2 text-indigo-100">
                        Seu perfil é <strong>{userStyle}</strong>. Encontramos mentores que ensinam exatamente como você aprende.
                    </p>
                </div>
                <div className="absolute right-0 top-0 opacity-10">
                    <Brain className="w-64 h-64 transform translate-x-12 -translate-y-12" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((mentor, idx) => (
                    <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="h-full hover:shadow-lg transition-all border-indigo-100">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100">
                                    <img
                                        src={mentor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.username}`}
                                        alt={mentor.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{mentor.username}</CardTitle>
                                    <Badge variant="secondary" className="mt-1 bg-indigo-100 text-indigo-700">
                                        Nível {mentor.level}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Brain className="w-4 h-4 text-indigo-500" />
                                    Estilo: {mentor.learningStyle}
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-3">
                                    {mentor.bio || "Este mentor ainda não adicionou uma bio, mas o algoritmo detectou alta compatibilidade."}
                                </p>
                                <div className="flex gap-2 pt-2">
                                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                        <UserPlus className="w-4 h-4" /> Conectar
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <MessageCircle className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
