import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ArenaLoading() {
    return (
        <div className="container mx-auto p-4 space-y-8">
            <header className="relative overflow-hidden bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm shadow-xl h-40">
                <Skeleton className="h-10 w-64 mb-4 bg-zinc-800" />
                <Skeleton className="h-6 w-full max-w-2xl bg-zinc-800" />
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card key={i} className="h-full border-zinc-800 bg-zinc-900/50">
                        <CardHeader>
                            <Skeleton className="h-8 w-48 bg-zinc-800" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Skeleton className="h-16 w-full bg-zinc-800" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40 bg-zinc-800" />
                                <Skeleton className="h-4 w-48 bg-zinc-800" />
                            </div>
                            <Skeleton className="h-14 w-full bg-zinc-800 mt-6" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
