export default function DashboardLoading() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer ring */}
                <div className="absolute inset-0 w-24 h-24 rounded-full border border-neon-blue/20 animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-0 w-24 h-24 rounded-full border-t-2 border-neon-blue animate-[spin_2s_linear_infinite]" />
                
                {/* Inner hex */}
                <div className="w-12 h-12 bg-neon-blue/10 border border-neon-blue/40 rounded shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                    <div className="w-6 h-6 bg-neon-purple/50 rounded-full animate-ping" />
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-xl font-mono tracking-widest text-white uppercase flex items-center gap-2">
                    Loading Data
                    <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                </h2>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                    Synchronizing blocks...
                </p>
            </div>
        </div>
    );
}
