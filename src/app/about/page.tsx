import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 max-w-4xl mx-auto">
            <Link href="/">
                <Button variant="ghost" className="mb-8 text-slate-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Home
                </Button>
            </Link>

            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Sobre o Match&Learn
            </h1>

            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                <p>
                    O <strong>Match&Learn</strong> é uma plataforma revolucionária que combina educação e gamificação através da tecnologia Web3 invisível.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8">Como funciona?</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Aprenda</strong>: Consuma conteúdo educacional no formato de feed (como TikTok/Instagram).</li>
                    <li><strong>Batalhe</strong>: Teste seu conhecimento na Arena contra a IA ou outros jogadores.</li>
                    <li><strong>Ganhe</strong>: Receba recompensas reais (Tokens e NFTs) pelo seu progresso.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8">Tecnologia</h2>
                <p>
                    Utilizamos Blockchain para garantir a propriedade real dos seus itens e conquistas, mas você não precisa entender de cripto para usar. Nossa tecnologia de &quot;Invisible Wallet&quot; cuida de tudo para você.
                </p>
            </div>
        </div>
    );
}
