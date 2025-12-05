'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { startBotBattle } from '@/server/actions/battle';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Swords } from 'lucide-react';

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

    return (
        <div className="container mx-auto p-4 space-y-6">
            <header className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-6 rounded-xl border border-red-500/20">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600">
                    Arena de Batalha
                </h1>
                <p className="text-muted-foreground mt-1">
                    Desafie seus conhecimentos e ganhe recompensas.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent hover:shadow-lg transition-all hover:border-red-500/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Swords className="h-5 w-5 text-red-500" />
                            Batalha Rápida (vs Bot)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-6 text-sm text-muted-foreground">
                            Teste suas habilidades contra nossa IA. Responda perguntas rápidas e ganhe XP instantâneo.
                        </p>
                        <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleStartBattle}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Preparando Arena...
                                </>
                            ) : (
                                'Entrar na Arena'
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="opacity-50 grayscale">
                    <CardHeader>
                        <CardTitle>PvP Rankeado (Em Breve)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-6 text-sm text-muted-foreground">
                            Desafie outros jogadores em tempo real e suba no ranking global.
                        </p>
                        <Button disabled className="w-full" variant="outline">
                            Bloqueado
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
