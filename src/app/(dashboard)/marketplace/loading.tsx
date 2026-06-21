import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function MarketplaceLoading() {
    return (
        <div className="container mx-auto p-4 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/40 p-6 rounded-xl border border-zinc-800/50">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48 bg-zinc-800" />
                    <Skeleton className="h-5 w-64 bg-zinc-800" />
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                    <Skeleton className="h-6 w-16 bg-zinc-800" />
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="flex flex-col border-2 border-slate-800 bg-slate-900">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Skeleton className="h-6 w-32 bg-zinc-800" />
                                <Skeleton className="h-5 w-16 bg-zinc-800 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-full bg-zinc-800" />
                            <Skeleton className="h-4 w-4/5 bg-zinc-800 mt-1" />
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center py-6">
                            <Skeleton className="h-24 w-24 rounded-full bg-zinc-800" />
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-slate-950/30 p-4 border-t border-slate-800">
                            <Skeleton className="h-6 w-16 bg-zinc-800" />
                            <Skeleton className="h-10 w-24 bg-zinc-800" />
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800">
                <Skeleton className="h-8 w-48 bg-zinc-800 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="aspect-square rounded-xl bg-zinc-800" />
                    ))}
                </div>
            </div>
        </div>
    );
}
