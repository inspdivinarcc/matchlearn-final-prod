'use client';

import { getFeedContent } from '@/server/actions/feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Swords, Brain, PlayCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FeedSection() {
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFeedContent().then((data) => {
            if (data.success && data.data) {
                setFeedItems(data.data);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!feedItems || feedItems.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>Nenhum conteúdo disponível no momento.</p>
                <p className="text-sm">Tente usar o botão de Seed acima.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedItems.map((item: any) => (
                <Card key={item.id} className="flex flex-col hover:shadow-lg transition-shadow border-indigo-500/10">
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="capitalize">
                                {item.type}
                            </Badge>
                            <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
                                +{item.xpReward} XP
                            </Badge>
                        </div>
                        <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                            {item.description}
                        </p>
                        <Button className="w-full gap-2 group">
                            {item.type === 'article' && <BookOpen className="h-4 w-4" />}
                            {item.type === 'challenge' && <Swords className="h-4 w-4" />}
                            {item.type === 'quiz' && <Brain className="h-4 w-4" />}
                            {item.type === 'video' && <PlayCircle className="h-4 w-4" />}
                            Começar
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
