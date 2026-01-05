"use client";

import React, { useState, useEffect } from 'react';
import { LiquidUI } from '@/components/trinity/LiquidUI';
import { CupidMatch } from '@/components/trinity/CupidMatch';
import { MarketView } from '@/components/trinity/MarketView';
import { SmartEscrow } from '@/components/trinity/SmartEscrow';
import { WalletPanel } from '@/components/trinity/WalletPanel';
import { Activity, Hexagon } from 'lucide-react';

export default function TrinityPage() {
    const [bootSequence, setBootSequence] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setBootSequence(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (bootSequence) {
        return (
            <div className="h-screen w-full bg-omega-dark flex flex-col items-center justify-center text-neon-blue font-mono">
                <div className="relative">
                    <div className="absolute inset-0 bg-neon-blue blur-xl opacity-20 animate-pulse"></div>
                    <Hexagon size={64} className="animate-spin-slow" />
                </div>
                <div className="mt-8 text-xl tracking-[0.5em] animate-pulse">TRINITY Σ</div>
                <div className="mt-2 text-xs text-neon-purple opacity-70">LOADING NEURAL INTERFACE...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-omega-dark p-4 md:p-8 font-sans selection:bg-neon-blue/30 selection:text-white overflow-hidden relative">
            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/5 blur-[100px] rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <Hexagon className="text-neon-blue" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-widest text-white">TRINITY <span className="text-neon-purple">Σ</span></h1>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-mono text-gray-400 uppercase">System Online • v1.0.4</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Network Latency</div>
                            <div className="text-neon-blue font-mono">12ms</div>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10"></div>
                        <div className="text-right">
                            <div className="text-[10px] text-gray-500 font-mono uppercase">Cpu Load</div>
                            <div className="text-neon-purple font-mono">14%</div>
                        </div>
                    </div>
                </header>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Column 1: Profile & Skills */}
                    <div className="md:col-span-3 space-y-6">
                        <LiquidUI title="NEURAL_MATCH" cognitiveLoad="high">
                            <CupidMatch />
                        </LiquidUI>
                        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center">
                            <Activity size={24} className="mx-auto text-gray-600 mb-2" />
                            <div className="text-xs text-gray-500 uppercase font-mono">System Monitoring Active</div>
                        </div>
                    </div>

                    {/* Column 2: Market Feed */}
                    <div className="md:col-span-5">
                        <LiquidUI title="MARKET_FEED" cognitiveLoad="low">
                            <MarketView />
                        </LiquidUI>
                    </div>

                    {/* Column 3: Wallet & Escrow */}
                    <div className="md:col-span-4 space-y-6">
                        <LiquidUI title="WALLET_HOLO" cognitiveLoad="low">
                            <WalletPanel />
                        </LiquidUI>
                        <LiquidUI title="SMART_ESCROW" cognitiveLoad="high">
                            <SmartEscrow />
                        </LiquidUI>
                    </div>

                </div>
            </div>
        </div>
    );
}
