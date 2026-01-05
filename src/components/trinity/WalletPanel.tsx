import React from 'react';
import { Wallet, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const WalletPanel = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neon-blue/10 rounded-lg">
                        <Wallet className="text-neon-blue" size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 font-mono uppercase">Total Balance</div>
                        <div className="text-2xl font-bold font-mono tracking-tighter glow-text">$12,450.80</div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-xs text-green-400 font-mono">
                        <ShieldCheck size={12} />
                        ENCRYPTED
                    </div>
                    <div className="text-[10px] text-gray-600 font-mono">0x7F...3a9B</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <ArrowUpRight className="text-gray-400 group-hover:text-neon-blue" size={16} />
                        <span className="text-[10px] text-gray-500 uppercase">Send</span>
                    </div>
                    <div className="text-sm font-bold text-gray-200">Transfer</div>
                </button>
                <button className="bg-neon-purple/10 hover:bg-neon-purple/20 p-3 rounded-xl border border-neon-purple/20 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <ArrowDownLeft className="text-neon-purple" size={16} />
                        <span className="text-[10px] text-neon-purple/70 uppercase">Receive</span>
                    </div>
                    <div className="text-sm font-bold text-white">Deposit</div>
                </button>
            </div>

            <div className="space-y-2">
                <div className="text-xs text-gray-500 font-mono uppercase mb-3">Assets</div>
                {[
                    { sym: 'ETH', name: 'Ethereum', val: '2.45', usd: '$8,240' },
                    { sym: 'TRN', name: 'Trinity', val: '15,000', usd: '$3,100' }
                ].map((asset, i) => (
                    <div key={i} className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-[10px] font-bold">
                                {asset.sym}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{asset.name}</span>
                                <span className="text-xs text-gray-500">{asset.val} {asset.sym}</span>
                            </div>
                        </div>
                        <span className="font-mono text-sm">{asset.usd}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
