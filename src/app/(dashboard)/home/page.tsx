import { Suspense } from 'react';
import { FeedSection } from './feed-section';
import { FeedSkeleton } from '@/components/feed-skeleton';
import { getUserWallet } from '@/server/actions/wallet';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    // Fetch wallet
    const walletData = await getUserWallet();
    const walletAddress = walletData.success ? walletData.address : null;

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Dev Tools (Temporary) */}
            <div className="flex justify-end">
                <form action={async () => {
                    'use server';
                    const { seedInitialContent } = await import('@/server/actions/seed');
                    await seedInitialContent();
                }}>
                    <Button variant="outline" size="sm" type="submit">
                        🌱 Seed Content
                    </Button>
                </form>
            </div>

            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-xl border border-indigo-500/20">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        Olá, {user?.name?.split(' ')[0] || 'Herói'}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Sua jornada de aprendizado continua.
                    </p>
                </div>

                {/* Wallet Status */}
                <div className="flex items-center gap-2 bg-background/50 p-2 rounded-lg border shadow-sm">
                    <div className={`h-2 w-2 rounded-full ${walletAddress ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-xs font-mono text-muted-foreground">
                        {walletAddress ?
                            `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` :
                            'Criando Wallet...'}
                    </span>
                    {walletAddress && <Badge variant="secondary" className="text-[10px] h-5">Invisible Web3</Badge>}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Energia Diária</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">100/100</div>
                        <Progress value={100} className="mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vitórias na Arena</CardTitle>
                        <Trophy className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">+0% essa semana</p>
                    </CardContent>
                </Card>
            </div>

            {/* Feed Section with Suspense */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Sua Jornada</h2>
                <Suspense fallback={<FeedSkeleton />}>
                    <FeedSection />
                </Suspense>
            </div>
        </div>
    );
}
