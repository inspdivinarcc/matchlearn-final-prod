"use client";

import React, { useState } from 'react';
import { TrendingUp, Clock, Globe, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { applyForGig } from '@/server/actions/gig';

interface Gig {
    id: string;
    title: string;
    reward: number;
    type: string;
    timeEstimate: string;
    difficulty: string;
}

export const MarketViewClient = ({ initialGigs }: { initialGigs: Gig[] }) => {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [filter, setFilter] = useState('All');

    const handleApply = async (gigId: string, reward: number) => {
        setLoadingId(gigId);
        try {
            const result = await applyForGig(gigId);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            toast.error('Failed to connect to Neural Contract.');
        } finally {
            setLoadingId(null);
        }
    };

    const filteredGigs = filter === 'All'
        ? initialGigs
        : initialGigs.filter(g => g.type.includes(filter) || g.difficulty === filter);

    return (
        <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Frontend', 'Security', 'Data', 'Hard'].map((f, i) => (
                    <button
                        key={i}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredGigs.length === 0 && (
                    <div className="text-center py-8 text-gray-500 font-mono text-xs">
                        NO SIGNALS DETECTED.
                    </div>
                )}
                {filteredGigs.map((gig, index) => (
                    <div key={gig.id} className="group relative bg-black/40 border border-white/5 hover:border-neon-blue/50 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:-translate-y-0.5">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2">
                                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400 font-mono uppercase border border-white/5 group-hover:border-neon-blue/20 transition-colors">{gig.type}</span>
                                {gig.difficulty === 'Hard' && <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-[10px] text-red-400 font-mono uppercase animate-pulse"><Zap size={10} /> HARD</span>}
                            </div>
                            <span className="text-neon-blue font-mono font-bold text-sm drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">{gig.reward} USDC</span>
                        </div>

                        <h4 className="text-lg font-medium text-gray-100 group-hover:text-white mb-2 transition-colors">{gig.title}</h4>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1"><Globe size={12} /> Remote</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {gig.timeEstimate}</span>
                            </div>
                            <button
                                onClick={() => handleApply(gig.id, gig.reward)}
                                disabled={!!loadingId}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue hover:text-white font-mono flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                            >
                                {loadingId === gig.id ? <Loader2 className="animate-spin" size={14} /> : '[INITIATE_]'}
                                {loadingId !== gig.id && <span className="text-lg leading-none">&rarr;</span>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
