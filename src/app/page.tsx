import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Sparkles } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/home');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl animate-float">
            <Rocket className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200">
          Match&Learn
        </h1>

        <p className="text-xl md:text-2xl text-purple-200/80 font-light">
          Aprenda, Batalhe e Ganhe recompensas reais.
          <br />
          <span className="text-base mt-2 block opacity-70">A revolução da educação gamificada com Web3 Invisível.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/api/auth/signin">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-100 font-bold text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              Começar Agora
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="border-purple-400/30 text-purple-100 hover:bg-purple-900/50 font-medium text-lg px-8 py-6 rounded-full">
              Saiba Mais
            </Button>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-purple-400/40 text-sm">
        © 2025 Match&Learn Protocol
      </footer>
    </div>
  );
}
