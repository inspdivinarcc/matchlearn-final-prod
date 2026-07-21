'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Send, Plus, Image as ImageIcon, Video, X, Loader2 } from 'lucide-react';
import { createPost, getFeed, toggleLike, getStories, createStory } from '@/server/actions/social';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes('video');
}

export default function SocialPage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<any[]>([]);
    const [dbStories, setDbStories] = useState<any[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newStoryContent, setNewStoryContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isPostingStory, setIsPostingStory] = useState(false);
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [storyMediaUrl, setStoryMediaUrl] = useState<string | null>(null);
    const [storyMediaType, setStoryMediaType] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        // Simular progresso enquanto faz upload
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Falha no upload');
            }

            const data = await response.json();
            setUploadProgress(100);
            setStoryMediaUrl(data.url);
            setStoryMediaType(data.type);
            toast.success('Mídia carregada!');
        } catch (error: any) {
            clearInterval(progressInterval);
            toast.error(error.message || 'Erro no upload.');
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
        // Limpar o input para permitir re-seleção do mesmo arquivo
        e.target.value = '';
    };

    const clearMedia = () => {
        setStoryMediaUrl(null);
        setStoryMediaType(null);
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
        if (!newStoryContent.trim() && !storyMediaUrl) return;

        setIsPostingStory(true);
        const result = await createStory(newStoryContent || '', storyMediaUrl || undefined);
        setIsPostingStory(false);

        if (result.success) {
            setNewStoryContent('');
            clearMedia();
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
            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={handleFileSelect}
            />

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
                <Dialog open={isStoryOpen} onOpenChange={(open) => {
                    setIsStoryOpen(open);
                    if (!open) {
                        clearMedia();
                        setNewStoryContent('');
                    }
                }}>
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
                            {/* Preview de Mídia */}
                            {storyMediaUrl && (
                                <div className="relative rounded-xl overflow-hidden bg-slate-800 max-h-64">
                                    <button
                                        onClick={clearMedia}
                                        className="absolute top-2 right-2 z-10 bg-black/60 rounded-full p-1.5 hover:bg-black/80 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                    {storyMediaType?.startsWith('video') ? (
                                        <video
                                            src={storyMediaUrl}
                                            className="w-full max-h-64 object-contain"
                                            controls
                                            muted
                                        />
                                    ) : (
                                        <img
                                            src={storyMediaUrl}
                                            alt="Preview"
                                            className="w-full max-h-64 object-contain"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Barra de Progresso do Upload */}
                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Enviando mídia...
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Input de texto */}
                            <Input
                                placeholder={storyMediaUrl ? "Adicione uma legenda (opcional)..." : "Compartilhe uma ideia rápida (some em 24h)..."}
                                className="bg-slate-800 border-slate-700 text-slate-200 focus-visible:ring-indigo-500"
                                value={newStoryContent}
                                onChange={(e) => setNewStoryContent(e.target.value)}
                                maxLength={100}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateStory()}
                            />

                            {/* Botões de ação */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        <ImageIcon className="w-5 h-5 mr-1" /> Foto
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-400 hover:text-purple-400 hover:bg-slate-800"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        <Video className="w-5 h-5 mr-1" /> Vídeo
                                    </Button>
                                </div>
                                <Button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={handleCreateStory}
                                    disabled={isPostingStory || isUploading || (!newStoryContent.trim() && !storyMediaUrl)}
                                >
                                    {isPostingStory ? (
                                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Enviando...</>
                                    ) : 'Publicar'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Real DB Stories */}
                {dbStories.map((story) => (
                    <Dialog key={story.id}>
                        <DialogTrigger asChild>
                            <div className="flex flex-col items-center space-y-2 min-w-[72px] cursor-pointer group">
                                <div className={`w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr ${story.imageUrl ? 'from-pink-500 to-amber-500' : 'from-indigo-500 to-purple-500'} group-hover:scale-105 transition-transform`}>
                                    <div className="w-full h-full rounded-full bg-background border-2 border-background flex items-center justify-center overflow-hidden">
                                        {story.imageUrl && !isVideoUrl(story.imageUrl) ? (
                                            <img src={story.imageUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Avatar className="w-full h-full">
                                                <AvatarFallback className="bg-slate-800 text-white font-bold">
                                                    {story.author.username?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground truncate w-full text-center">
                                    {story.author.username?.split(' ')[0] || 'User'}
                                </span>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-200 flex flex-col justify-center items-center relative overflow-hidden min-h-[400px]">
                            {/* Background Media */}
                            {story.imageUrl && (
                                <div className="absolute inset-0 z-0">
                                    {isVideoUrl(story.imageUrl) ? (
                                        <video
                                            src={story.imageUrl}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={story.imageUrl}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/30" />
                                </div>
                            )}
                            {!story.imageUrl && (
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 -z-10" />
                            )}

                            {/* Header */}
                            <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
                                <Avatar className="border-2 border-indigo-500">
                                    <AvatarFallback className="bg-slate-800 text-white font-bold">
                                        {story.author.username?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-white drop-shadow-lg">{story.author.username}</span>
                                    <span className="text-xs text-slate-300 drop-shadow-lg">
                                        {new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            {story.content && (
                                <p className="text-2xl font-bold text-center p-6 text-white leading-relaxed z-10 drop-shadow-lg">
                                    {story.content}
                                </p>
                            )}
                        </DialogContent>
                    </Dialog>
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
