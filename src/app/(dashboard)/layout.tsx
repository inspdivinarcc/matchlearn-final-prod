import { TrinityNavigation } from '@/components/trinity/TrinityNavigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-omega-dark text-white selection:bg-neon-blue/30 selection:text-white">
            {/* Background Ambience Global */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/5 blur-[100px] rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            <TrinityNavigation />
            <main className="flex-1 relative z-10">
                {children}
            </main>
        </div>
    );
}
