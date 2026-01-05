'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function InventoryGrid({ items }: { items: any[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30">
                <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300">Seu inventário está vazio</h3>
                <p className="text-slate-500">Compre itens no marketplace para vê-los aqui.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, idx) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden relative group hover:border-indigo-500/50 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-medium text-slate-200 truncate pr-2">
                                    {item.name}
                                </CardTitle>
                                <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                                    {item.rarity}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Sparkles className="w-3 h-3 text-yellow-500" />
                                <span>Item #{item.tokenId}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
