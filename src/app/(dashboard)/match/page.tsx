'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Rocket, Plus, Search, Code2, Zap, Brain } from 'lucide-react';
import { createProject, getProjects, joinProject } from '@/server/actions/match';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MatchPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', tags: '' });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const data = await getProjects();
        setProjects(data);
    };

    const handleCreateProject = async () => {
        if (!newProject.name || !newProject.description) return;

        setIsCreating(true);
        const tagsArray = newProject.tags.split(',').map(t => t.trim()).filter(Boolean);
        const result = await createProject(newProject.name, newProject.description, tagsArray);
        setIsCreating(false);

        if (result.success) {
            setIsOpen(false);
            setNewProject({ name: '', description: '', tags: '' });
            toast.success('Projeto criado com sucesso!');
            loadProjects();
        } else {
            toast.error('Erro ao criar projeto.');
        }
    };

    const handleJoin = async (projectId: string) => {
        toast.promise(joinProject(projectId), {
            loading: 'Enviando solicitação...',
            success: () => {
                loadProjects();
                return 'Solicitação enviada!';
            },
            error: 'Erro ao entrar no projeto.'
        });
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-600 to-cyan-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold flex items-center gap-3">
                        Encontre sua Squad <Rocket className="w-8 h-8 animate-bounce" />
                    </h1>
                    <p className="text-white mt-2 text-lg max-w-xl">
                        Conecte-se com outros desenvolvedores, forme equipes e construa projetos incríveis juntos.
                    </p>
                </div>

                <div className="flex gap-3 relative z-10">
                    <Link href="/match/neural">
                        <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold backdrop-blur-sm">
                            <Brain className="w-5 h-5 mr-2" /> Neural Match
                        </Button>
                    </Link>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg">
                                <Plus className="w-5 h-5 mr-2" /> Criar Projeto
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Novo Projeto</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome do Projeto</label>
                                    <Input
                                        placeholder="Ex: Clone do Uber, App de Finanças..."
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Descrição</label>
                                    <Textarea
                                        placeholder="Descreva o que você quer construir e quem você procura..."
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
                                    <Input
                                        placeholder="React, Node.js, Design, Marketing"
                                        value={newProject.tags}
                                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                                    />
                                </div>
                                <Button className="w-full" onClick={handleCreateProject} disabled={isCreating}>
                                    {isCreating ? 'Criando...' : 'Lançar Projeto'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search/Filter Bar (Visual only for now) */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Buscar por skills, nome do projeto..." className="pl-10" />
                </div>
                <Button variant="outline">Filtros</Button>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, idx) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-slate-900 border-slate-800 group">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-blue-900/30 text-blue-400 text-xs">
                                                {project.owner.username?.[0] || 'O'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-slate-400">por {project.owner.username}</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-900/20 text-blue-400">
                                        {project.members.length} membros
                                    </Badge>
                                </div>
                                <CardTitle className="mt-2 text-xl text-slate-200 group-hover:text-blue-400 transition-colors">
                                    {project.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <p className="text-slate-400 line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="border-slate-700 text-blue-400">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4 border-t border-slate-800 bg-slate-950/30">
                                <Button className="w-full gap-2" onClick={() => handleJoin(project.id)}>
                                    <Zap className="w-4 h-4" /> Aplicar para Equipe
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
