'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Edit2, Save, X, Brain,
    Zap, Activity, Award, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { getUserProfile, updateUserBio } from '@/server/actions/user';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bio, setBio] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const result = await getUserProfile();
            if (result.success && result.user) {
                setUser(result.user);
                setBio(result.user.bio || '');
            } else {
                toast.error('Erro ao carregar perfil');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBio = async () => {
        try {
            const result = await updateUserBio(bio);
            if (result.success) {
                toast.success('Bio atualizada com sucesso!');
                setIsEditingBio(false);
                setUser({ ...user, bio });
            } else {
                toast.error('Erro ao atualizar bio');
            }
        } catch (error) {
            toast.error('Erro ao salvar');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) return null;

    const totalVAK = (user.vakVisual || 0) + (user.vakAuditory || 0) + (user.vakKinesthetic || 0) || 1;
    const vPercent = Math.round(((user.vakVisual || 0) / totalVAK) * 100);
    const aPercent = Math.round(((user.vakAuditory || 0) / totalVAK) * 100);
    const kPercent = Math.round(((user.vakKinesthetic || 0) / totalVAK) * 100);

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="h-48 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                </div>

                <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
                    <Avatar className="w-32 h-32 border-4 border-slate-950 shadow-xl">
                        <AvatarImage src={user.image || ''} />
                        <AvatarFallback className="bg-slate-800 text-2xl">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="mb-4 space-y-1">
                        <h1 className="text-3xl font-bold text-white">{user.username || 'Usuário'}</h1>
                        <div className="flex items-center text-slate-300 space-x-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span>Nível {user.level}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-indigo-400">{user.xp} XP</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="h-12"></div> {/* Spacer for absolute positioning */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Left Column: Bio & Stats */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-400" />
                                Sobre
                            </CardTitle>
                            {!isEditingBio ? (
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(true)}>
                                    <Edit2 className="w-4 h-4 text-slate-400" />
                                </Button>
                            ) : (
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={handleSaveBio}>
                                        <Save className="w-4 h-4 text-green-400" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(false)}>
                                        <X className="w-4 h-4 text-red-400" />
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isEditingBio ? (
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="bg-slate-950 border-slate-700 min-h-[100px]"
                                    placeholder="Conte um pouco sobre você..."
                                />
                            ) : (
                                <p className="text-slate-200 leading-relaxed">
                                    {user.bio || "Nenhuma biografia definida."}
                                </p>
                            )}

                            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-2 text-sm text-slate-500">
                                <Calendar className="w-4 h-4" />
                                Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="w-5 h-5 text-green-400" />
                                Estatísticas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300">Moedas</span>
                                <span className="font-bold text-yellow-500">{user.coins} 🪙</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300">Vitórias</span>
                                <span className="font-bold text-white">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300">Sequência</span>
                                <span className="font-bold text-orange-500">🔥 0 dias</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column: Neural Profile */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 space-y-6"
                >
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

                        <CardHeader className="relative z-10 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl flex items-center gap-3">
                                    <Brain className="w-8 h-8 text-indigo-400" />
                                    Perfil Neural (VAK)
                                </CardTitle>
                                <p className="text-slate-300 mt-1">
                                    Seu estilo de aprendizado dominante é:
                                    <span className="text-indigo-400 font-bold ml-2">
                                        {user.learningStyle || 'NÃO DEFINIDO'}
                                    </span>
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => router.push('/profile/vak')}>
                                {user.learningStyle ? 'Refazer Teste' : 'Fazer Teste'}
                            </Button>
                        </CardHeader>

                        <CardContent className="relative z-10 space-y-8 mt-4">
                            {/* Visual */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2 text-blue-400">
                                        <Zap className="w-4 h-4" /> Visual
                                    </span>
                                    <span className="font-bold">{vPercent}%</span>
                                </div>
                                <Progress value={vPercent} className="h-3 bg-slate-700" indicatorClassName="bg-blue-500" />
                            </div>

                            {/* Auditory */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2 text-purple-400">
                                        <Activity className="w-4 h-4" /> Auditivo
                                    </span>
                                    <span className="font-bold">{aPercent}%</span>
                                </div>
                                <Progress value={aPercent} className="h-3 bg-slate-700" indicatorClassName="bg-purple-500" />
                            </div>

                            {/* Kinesthetic */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2 text-orange-400">
                                        <HandIcon className="w-4 h-4" /> Cinestésico
                                    </span>
                                    <span className="font-bold">{kPercent}%</span>
                                </div>
                                <Progress value={kPercent} className="h-3 bg-slate-700" indicatorClassName="bg-orange-500" />
                            </div>

                            {!user.learningStyle && (
                                <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-4 text-center mt-6">
                                    <p className="text-indigo-200 mb-3">
                                        Você ainda não descobriu seu estilo de aprendizado!
                                    </p>
                                    <Button onClick={() => router.push('/profile/vak')} className="bg-indigo-600 hover:bg-indigo-700">
                                        Descobrir Agora
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity Placeholder */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg">Atividade Recente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-slate-500">
                                Nenhuma atividade recente para mostrar.
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

function HandIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
    )
}
