'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Send, Plus } from 'lucide-react';
import { createPost, getFeed, toggleLike, getStories, createStory } from '@/server/actions/social';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SocialPage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<any[]>([]);
    const [dbStories, setDbStories] = useState<any[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newStoryContent, setNewStoryContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isPostingStory, setIsPostingStory] = useState(false);
    const [isStoryOpen, setIsStoryOpen] = useState(false);

    useEffect(() => {
        loadFeed();
        loadStories();
    }, []);

    const loadFeed = async () => {
        const feed = await getFeed();
        setPosts(feed);
    };

    const loadStories = async () => {
        const data = await getStories();
        setDbStories(data);
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;

        setIsPosting(true);
        const result = await createPost(newPostContent);
        setIsPosting(false);

        if (result.success) {
            setNewPostContent('');
            toast.success('Post criado com sucesso!');
            loadFeed();
        } else {
            toast.error('Erro ao criar post.');
        }
    };

    const handleCreateStory = async () => {
        if (!newStoryContent.trim()) return;

        setIsPostingStory(true);
        const result = await createStory(newStoryContent);
        setIsPostingStory(false);

        if (result.success) {
            setNewStoryContent('');
            setIsStoryOpen(false);
            toast.success('Story publicado!');
            loadStories();
        } else {
            toast.error('Erro ao publicar story.');
        }
    };

    const handleLike = async (postId: string) => {
        // Optimistic update
        setPosts(currentPosts =>
            currentPosts.map(p => {
                if (p.id === postId) {
                    const isLiked = p.likes.some((l: any) => l.userId === (session?.user as any)?.id);
                    return {
                        ...p,
                        _count: { ...p._count, likes: isLiked ? p._count.likes - 1 : p._count.likes + 1 },
                        likes: isLiked
                            ? p.likes.filter((l: any) => l.userId !== (session?.user as any)?.id)
                            : [...p.likes, { userId: (session?.user as any)?.id }]
                    };
                }
                return p;
            })
        );

        await toggleLike(postId);
        loadFeed(); // Sync with server
    };

    const mockStories = [
        { id: 'mock-1', user: 'Sarah Dev', avatar: 'S', color: 'from-pink-500 to-rose-500' },
        { id: 'mock-2', user: 'Alex Code', avatar: 'A', color: 'from-blue-500 to-cyan-500' },
        { id: 'mock-3', user: 'Mike AI', avatar: 'M', color: 'from-purple-500 to-indigo-500' },
        { id: 'mock-4', user: 'Emma UX', avatar: 'E', color: 'from-yellow-500 to-orange-500' },
    ];

    return (
        <div className="container mx-auto p-4 max-w-2xl space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                    Social Hub
                </h1>
                <Button variant="ghost" size="sm">
                    <MessageCircle className="w-6 h-6 text-muted-foreground" />
                </Button>
            </div>

            {/* Stories Rail */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {/* Create Story */}
                <Dialog open={isStoryOpen} onOpenChange={setIsStoryOpen}>
                    <DialogTrigger asChild>
                        <div className="flex flex-col items-center space-y-2 min-w-[72px] cursor-pointer group">
                            <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-slate-700 to-slate-600 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-full bg-background border-2 border-background flex items-center justify-center overflow-hidden">
                                    <Plus className="w-6 h-6 text-muted-foreground" />
                                </div>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground truncate w-full text-center">
                                Você
                            </span>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-200">
                        <DialogHeader>
                            <DialogTitle>Novo Story</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Compartilhe uma ideia rápida (some em 24h)..."
                                className="bg-slate-800 border-slate-700 text-slate-200 focus-visible:ring-indigo-500"
                                value={newStoryContent}
                                onChange={(e) => setNewStoryContent(e.target.value)}
                                maxLength={100}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateStory()}
                            />
                            <div className="flex justify-end">
                                <Button 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white" 
                                    onClick={handleCreateStory} 
                                    disabled={isPostingStory || !newStoryContent.trim()}
                                >
                                    {isPostingStory ? 'Enviando...' : 'Publicar'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Real DB Stories */}
                {dbStories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center space-y-2 min-w-[72px] cursor-pointer group">
                        <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-indigo-500 to-purple-500 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-full bg-background border-2 border-background flex items-center justify-center overflow-hidden">
                                <Avatar className="w-full h-full">
                                    <AvatarFallback className="bg-slate-800 text-white font-bold">
                                        {story.author.username?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground truncate w-full text-center">
                            {story.author.username?.split(' ')[0] || 'User'}
                        </span>
                    </div>
                ))}

                {/* Mock Stories (para não ficar vazio) */}
                {mockStories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center space-y-2 min-w-[72px] cursor-pointer group">
                        <div className={`w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr ${story.color} group-hover:scale-105 transition-transform`}>
                            <div className="w-full h-full rounded-full bg-background border-2 border-background flex items-center justify-center overflow-hidden">
                                <Avatar className="w-full h-full">
                                    <AvatarFallback className="bg-slate-800 text-white font-bold">{story.avatar}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground truncate w-full text-center">
                            {story.user}
                        </span>
                    </div>
                ))}
            </div>

            {/* Create Post */}
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="p-4 space-y-4">
                    <div className="flex gap-4">
                        <Avatar>
                            <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <Input
                            placeholder="O que você está construindo hoje?"
                            className="bg-transparent border-none focus-visible:ring-0 text-lg text-slate-200 placeholder:text-slate-500"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                        />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                        <div className="flex gap-2">
                            {/* Add media buttons here later */}
                        </div>
                        <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
                            onClick={handleCreatePost}
                            disabled={isPosting || !newPostContent.trim()}
                        >
                            {isPosting ? 'Publicando...' : 'Publicar'} <Send className="w-3 h-3 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Feed */}
            <div className="space-y-6">
                {posts.map((post) => {
                    const isLiked = post.likes.some((l: any) => l.userId === (session?.user as any)?.id);

                    return (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-slate-800 hover:border-indigo-500/30 transition-all duration-300 bg-slate-900/80 backdrop-blur-sm shadow-sm hover:shadow-md">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                                    {post.author.username?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-slate-200">{post.author.username}</p>
                                                <p className="text-xs text-slate-500">Level {post.author.level} • 2h</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-300 leading-relaxed text-lg">
                                        {post.content}
                                    </p>

                                    {post.imageUrl && (
                                        <div className="rounded-xl overflow-hidden bg-slate-800 aspect-video flex items-center justify-center">
                                            {/* Placeholder for image */}
                                            <span className="text-4xl">🖼️</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
                                        <button
                                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'}`}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                            {post._count.likes}
                                        </button>
                                        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-500 transition-colors">
                                            <MessageCircle className="w-5 h-5" />
                                            {post._count.comments}
                                        </button>
                                        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-500 transition-colors ml-auto">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
