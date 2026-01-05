'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUserWallet } from '@/server/actions/wallet';
import { LiquidUI } from '@/components/trinity/LiquidUI';
import { CupidMatch } from '@/components/trinity/CupidMatch';
import { MarketView } from '@/components/trinity/MarketView';
import { SmartEscrow } from '@/components/trinity/SmartEscrow';
import { WalletPanel } from '@/components/trinity/WalletPanel';
import { Activity, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
    const { data: session } = useSession();
    const user = session?.user as any;
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [bootSequence, setBootSequence] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setBootSequence(false), 1500);
        getUserWallet().then((data) => {
            if (data.success && data.address) {
                setWalletAddress(data.address);
            }
        });
        return () => clearTimeout(timer);
    }, []);

    if (bootSequence) {
        return (
            <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center text-neon-blue font-mono">
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto p-4 md:p-8"
        >
            {/* Header Info */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold tracking-widest text-white">
                        WELCOME, <span className="text-neon-blue">{user?.name?.split(' ')[0]?.toUpperCase() || 'OPERATOR'}</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">
                            ID: {user?.id?.slice(0, 8) || 'UNKNOWN'} • CLEARANCE: LEVEL 5
                        </span>
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
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Column 1: Profile & Skills */}
                <div className="md:col-span-3 space-y-6">
                    <LiquidUI title="NEURAL_MATCH" cognitiveLoad="high">
                        <CupidMatch />
                    </LiquidUI>
                    <div className="p-4 rounded-xl border border-dashed border-white/10 text-center hover:border-neon-blue/30 transition-colors cursor-pointer group">
                        <Activity size={24} className="mx-auto text-gray-600 mb-2 group-hover:text-neon-blue transition-colors" />
                        <div className="text-xs text-gray-500 uppercase font-mono group-hover:text-gray-300">System Monitoring Active</div>
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
        </motion.div>
    );
}
