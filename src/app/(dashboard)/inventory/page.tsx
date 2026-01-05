import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wallet, Trophy, Coins, Star } from 'lucide-react';

export default async function InventoryPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user) {
        return <div>Please log in.</div>;
    }

    // Fetch user inventory (NFTs)
    const inventory = await prisma.inventory.findUnique({
        where: { userId: user.id },
        include: { nfts: true },
    });

    const nfts = inventory?.nfts || [];

    return (
        <div className="container mx-auto p-4 space-y-6">
            <header className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-xl border border-emerald-500/20">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
                    Inventário
                </h1>
                <p className="text-muted-foreground mt-1">
                    Seus itens, conquistas e colecionáveis digitais.
                </p>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-yellow-500/20 bg-yellow-500/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-600">Coins</CardTitle>
                        <Coins className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.coins}</div>
                    </CardContent>
                </Card>
                <Card className="border-blue-500/20 bg-blue-500/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600">Nível</CardTitle>
                        <Star className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.level}</div>
                    </CardContent>
                </Card>
                <Card className="border-purple-500/20 bg-purple-500/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-purple-600">NFTs</CardTitle>
                        <Wallet className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{nfts.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* NFT Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Colecionáveis</h2>
                <ScrollArea className="h-[calc(100vh-350px)]">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pb-4">
                        {nfts.map((nft) => (
                            <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-slate-800 bg-slate-900 hover:border-indigo-500/50">
                                <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                                    <Trophy className="h-16 w-16 text-slate-500" />
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base text-slate-200">{nft.name}</CardTitle>
                                    <Badge variant="outline" className="mt-1 w-fit border-slate-700 text-slate-400">
                                        {nft.rarity}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-xs text-slate-500">
                                        Token ID: #{nft.tokenId || '???'}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                        {nfts.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                                <div className="bg-slate-800 p-4 rounded-full mb-4">
                                    <Wallet className="h-8 w-8 text-slate-500" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-200">Inventário Vazio</h3>
                                <p className="text-slate-400 max-w-sm mt-2">
                                    Suba de nível para ganhar Badges e NFTs exclusivos.
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
