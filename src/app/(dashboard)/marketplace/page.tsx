import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getShopItems } from '@/server/actions/shop';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, ShoppingBag } from 'lucide-react';
import { BuyButton } from './buy-button'; // Client component we'll create

export default async function MarketplacePage() {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    // Fetch fresh user data for coins
    const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;
    const currentCoins = dbUser?.coins || 0;

    const items = await getShopItems();

    return (
        <div className="container mx-auto p-4 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 rounded-xl border border-amber-500/20">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
                        Marketplace
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gaste suas moedas em itens exclusivos e boosters.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg border shadow-sm">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="text-xl font-bold">{currentCoins}</span>
                    <span className="text-xs text-muted-foreground uppercase ml-1">Coins</span>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <Card key={item.id} className="flex flex-col border-2 border-transparent hover:border-amber-500/50 transition-all hover:shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{item.name}</CardTitle>
                                <Badge variant="secondary" className="capitalize">{item.type}</Badge>
                            </div>
                            <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center py-6">
                            <div className="p-6 bg-amber-100/50 rounded-full">
                                <ShoppingBag className="h-10 w-10 text-amber-600" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-muted/20 p-4">
                            <div className="font-bold text-lg flex items-center gap-1">
                                {item.price} <Coins className="h-4 w-4 text-yellow-500" />
                            </div>
                            <BuyButton itemId={item.id} price={item.price} userCoins={currentCoins} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
