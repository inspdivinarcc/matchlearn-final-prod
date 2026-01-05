'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownLeft, Wallet, Coins, Diamond, History, CreditCard } from 'lucide-react';
import { getWalletBalance, getTransactions } from '@/server/actions/wallet';
import { motion } from 'framer-motion';

export default function WalletPage() {
    const [balance, setBalance] = useState<any>({ coins: 0, gems: 0, earnings: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [balanceData, txData] = await Promise.all([
                getWalletBalance(),
                getTransactions()
            ]);

            if (balanceData.success) setBalance(balanceData);
            if (txData.success) setTransactions(txData.transactions || []);
            setIsLoading(false);
        }
        loadData();
    }, []);

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Wallet className="w-8 h-8 text-indigo-500" /> Minha Carteira
            </h1>

            {/* Balance Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-none shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-100">Ganhos Totais (USD)</CardTitle>
                            <span className="font-bold text-2xl">$</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">${balance.earnings?.toFixed(2)}</div>
                            <p className="text-xs text-indigo-200 mt-1">+20.1% este mês</p>
                            <Button size="sm" className="mt-4 w-full bg-white/20 hover:bg-white/30 border-none">
                                <ArrowDownLeft className="w-4 h-4 mr-2" /> Sacar
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-none shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-100">MatchCoins</CardTitle>
                            <Coins className="w-6 h-6 text-amber-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{balance.coins?.toLocaleString()}</div>
                            <p className="text-xs text-amber-100 mt-1">Token de utilidade</p>
                            <Button size="sm" className="mt-4 w-full bg-white/20 hover:bg-white/30 border-none">
                                <ArrowUpRight className="w-4 h-4 mr-2" /> Comprar
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-none shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-cyan-100">Gemas</CardTitle>
                            <Diamond className="w-6 h-6 text-cyan-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{balance.gems?.toLocaleString()}</div>
                            <p className="text-xs text-cyan-100 mt-1">Moeda Premium</p>
                            <Button size="sm" className="mt-4 w-full bg-white/20 hover:bg-white/30 border-none">
                                <ArrowUpRight className="w-4 h-4 mr-2" /> Recarregar
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Transactions & Staking */}
            <Tabs defaultValue="transactions" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-slate-900">
                    <TabsTrigger value="transactions">Histórico</TabsTrigger>
                    <TabsTrigger value="staking">Staking (Earn)</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="mt-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5" /> Últimas Transações
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transactions.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        Nenhuma transação encontrada.
                                    </div>
                                ) : (
                                    transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-800 bg-slate-950/50">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${tx.type === 'EARN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {tx.type === 'EARN' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{tx.description}</p>
                                                    <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className={`font-bold ${tx.type === 'EARN' ? 'text-green-500' : 'text-slate-200'}`}>
                                                {tx.type === 'EARN' ? '+' : '-'}{tx.amount} {tx.currency}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="staking" className="mt-6">
                    <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <CardContent className="p-8 text-center relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Faça Staking dos seus MatchCoins</h3>
                            <p className="text-slate-300 mb-8 max-w-md mx-auto">
                                Bloqueie seus tokens por 30 dias e ganhe 12% APY. Aumente seu nível de mentor e desbloqueie taxas menores.
                            </p>
                            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-none text-white font-bold">
                                Iniciar Staking
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
