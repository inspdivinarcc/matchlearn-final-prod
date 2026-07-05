"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Swords, Backpack, LogOut, ShoppingBag, MessageCircle, Users, Wallet, Zap, Brain, Hexagon, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export function TrinityNavigation() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const links = [
        { href: '/home', label: 'HOME', icon: Home },
        { href: '/social', label: 'SOCIAL', icon: MessageCircle },
        { href: '/match', label: 'MATCH', icon: Users },
        { href: '/match/neural', label: 'NEURAL', icon: Brain },
        { href: '/flash-solve', label: 'SOLVE', icon: Zap },
        { href: '/wallet', label: 'WALLET', icon: Wallet },
        { href: '/arena', label: 'ARENA', icon: Swords },
        { href: '/marketplace', label: 'MARKET', icon: ShoppingBag },
        { href: '/inventory', label: 'ITEMS', icon: Backpack },
    ];

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <nav className="border-b border-white/10 bg-omega-dark/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/home" className="flex items-center gap-3 group">
                        <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 group-hover:border-neon-blue/50 transition-colors">
                            <Hexagon className="text-neon-blue group-hover:animate-spin-slow" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-widest text-white leading-none">TRINITY <span className="text-neon-purple">Σ</span></span>
                            <span className="text-[8px] text-gray-500 font-mono uppercase tracking-[0.2em] leading-none">Match&Learn Protocol</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {links.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href || pathname?.startsWith(href + '/');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-300",
                                        isActive
                                            ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_10px_rgba(0,240,255,0.2)] drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon size={14} className={cn(isActive && "animate-pulse drop-shadow-[0_0_2px_rgba(0,240,255,0.8)]")} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 px-4 border-r border-white/10">
                        <div className="text-right">
                            <div className="text-[9px] text-gray-500 font-mono uppercase">Sys.Status</div>
                            <div className="text-green-400 font-mono text-xs flex items-center justify-end gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                ONLINE
                            </div>
                        </div>
                    </div>

                    {/* Disconnect Button (Desktop) */}
                    <button
                        onClick={handleSignOut}
                        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors text-xs font-mono uppercase"
                    >
                        <LogOut size={12} />
                        Disconnect
                    </button>

                    {/* Mobile Menu Toggle Button */}
                    <button 
                        className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 right-0 bg-omega-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col p-4 gap-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {links.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href || pathname?.startsWith(href + '/');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-mono uppercase tracking-wider transition-all duration-300",
                                        isActive
                                            ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon size={18} className={cn(isActive && "drop-shadow-[0_0_2px_rgba(0,240,255,0.8)]")} />
                                    {label}
                                </Link>
                            );
                        })}
                        
                        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-4">
                            <div className="flex items-center justify-between px-4">
                                <div className="text-[10px] text-gray-500 font-mono uppercase">Sys.Status</div>
                                <div className="text-green-400 font-mono text-xs flex items-center justify-end gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    ONLINE
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="flex w-full justify-center items-center gap-2 px-4 py-3 rounded border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors text-sm font-mono uppercase"
                            >
                                <LogOut size={16} />
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
