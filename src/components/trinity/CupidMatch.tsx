import React from 'react';
import { Check, X, Code2, Cpu } from 'lucide-react';

export const CupidMatch = () => {
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-neon-purple/20 blur-2xl rounded-full opacity-40"></div>

            <div className="relative bg-gradient-to-b from-gray-800/80 to-gray-900 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="h-28 bg-gradient-to-r from-indigo-900 via-purple-900/80 to-gray-900 relative">
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono text-neon-blue border border-neon-blue/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                        98% MATCH
                    </div>
                </div>

                <div className="px-4 pb-4 -mt-10">
                    <div className="w-20 h-20 rounded-xl bg-gray-950 border-2 border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.3)] flex items-center justify-center mb-3 overflow-hidden">
                        <Cpu className="text-gray-600" size={40} />
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight">Protocol Architect</h3>
                    <p className="text-xs text-gray-400 font-mono mb-3">Cyberdyne Systems</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                        {['Solidity', 'Rust', 'Zero-Knowledge'].map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[9px] text-gray-300 border border-white/5">{tag}</span>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 transition-colors">
                            <X size={18} />
                        </button>
                        <button className="flex-1 py-2 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 rounded-lg flex items-center justify-center text-neon-blue transition-colors">
                            <Check size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
