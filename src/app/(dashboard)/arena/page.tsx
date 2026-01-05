'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { startBotBattle } from '@/server/actions/battle';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Swords, Trophy, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArenaPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartBattle = async () => {
        setIsLoading(true);
        try {
            const result = await startBotBattle('general'); // Default topic for now
            if (result.success && result.battleId) {
                // Redirect with questionId if available
                const url = result.questionId
                    ? `/arena/${result.battleId}?q=${result.questionId}`
                    : `/arena/${result.battleId}`;
                router.push(url);
            } else {
                console.error('Failed to start battle:', result.error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error starting battle:', error);
            setIsLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="container mx-auto p-4 space-y-8"
        >
            <motion.header
                variants={item}
                className="relative overflow-hidden bg-gradient-to-r from-red-900/40 to-orange-900/40 p-8 rounded-3xl border border-red-500/20 backdrop-blur-sm shadow-xl"
            >
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />

                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-3">
                    Arena de Batalha <Swords className="w-8 h-8 text-red-500 animate-pulse" />
                </h1>
                <p className="text-red-100 mt-2 text-lg font-light max-w-2xl">
                    Prove seu valor. Desafie a IA ou outros jogadores para ganhar XP, Moedas e Glória Eterna.
                </p>
            </motion.header>

            <motion.div variants={container} className="grid gap-6 md:grid-cols-2">
                <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="h-full border-red-500/30 bg-gradient-to-br from-red-950/50 to-black/50 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl text-red-500">
                                <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                    <Zap className="h-6 w-6" />
                                </div>
                                Batalha Rápida (vs Bot)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <p className="text-slate-300 text-lg">
                                Teste suas habilidades contra nossa IA. Responda perguntas rápidas e ganhe XP instantâneo.
                            </p>
                            <ul className="space-y-2 text-sm text-red-200">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Ganhe até 50 XP por vitória</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Sem custo de energia (por enquanto)</li>
                            </ul>
                            <Button
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-6 text-lg shadow-lg shadow-red-900/20"
                                onClick={handleStartBattle}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Preparando Arena...
                                    </>
                                ) : (
                                    'Entrar na Arena'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="h-full border-zinc-800 bg-zinc-900/50 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl text-zinc-400">
                                <div className="p-2 bg-zinc-800 rounded-lg">
                                    <Users className="h-6 w-6" />
                                </div>
                                PvP Rankeado
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-muted-foreground text-lg">
                                Desafie outros jogadores em tempo real e suba no ranking global.
                            </p>
                            <div className="flex items-center justify-center py-8">
                                <Trophy className="w-16 h-16 text-zinc-700" />
                            </div>
                            <Button disabled className="w-full bg-zinc-800 text-zinc-400 border border-zinc-700" variant="outline">
                                Em Breve
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
