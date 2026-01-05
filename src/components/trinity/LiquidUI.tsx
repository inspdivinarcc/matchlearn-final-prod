import React, { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

interface LiquidUIProps {
    children: ReactNode;
    title: string;
    cognitiveLoad?: 'low' | 'medium' | 'high';
}

export const LiquidUI = ({ children, title, cognitiveLoad = 'low' }: LiquidUIProps) => {
    return (
        <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cognitiveLoad === 'high' ? 'bg-neon-purple shadow-[0_0_8px_#bc13fe]' : 'bg-neon-blue shadow-[0_0_8px_#00f0ff]'}`}></div>
                    <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">{title}</span>
                </div>
                <MoreHorizontal size={14} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};
