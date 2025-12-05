'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Swords, Backpack, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from './button';
import { signOut } from 'next-auth/react';

export function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: '/home', label: 'Home', icon: Home },
        { href: '/arena', label: 'Arena', icon: Swords },
        { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
        { href: '/inventory', label: 'Inventário', icon: Backpack },
    ];

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/home" className="flex items-center space-x-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        <span>Match&Learn</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        {links.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                    pathname === href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                </Button>
            </div>
        </nav>
    );
}
