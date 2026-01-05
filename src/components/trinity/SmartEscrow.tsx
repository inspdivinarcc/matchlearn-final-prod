import React from 'react';
import { Lock, FileCheck, AlertCircle } from 'lucide-react';

export const SmartEscrow = () => {
    return (
        <div className="space-y-5">
            <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 blur-2xl"></div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                        <Lock size={18} />
                    </div>
                    <div>
                        <div className="text-xs text-green-400/80 font-mono uppercase">Status: Active Escrow</div>
                        <div className="text-white font-bold">Project: Neon UI System</div>
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Locked Amount</span>
                        <span className="font-mono text-white">1,200 USDC</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-green-500 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase">
                        <span>Milestone 2/3</span>
                        <span>66% Complete</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-gray-500">Recent Activity</h4>
                {[
                    { action: 'Contract Deployed', hash: '0x88...12F', status: 'success' },
                    { action: 'Funds Deposited', hash: '0x32...99A', status: 'success' },
                    { action: 'Milestone 1 Approved', hash: '0x11...BB3', status: 'pending' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            {item.status === 'success' ? <FileCheck size={14} className="text-gray-600 group-hover:text-green-400" /> : <AlertCircle size={14} className="text-orange-400" />}
                            <span className="text-sm text-gray-300">{item.action}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-600">{item.hash}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
