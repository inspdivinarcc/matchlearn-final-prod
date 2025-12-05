'use client';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, Crown, Diamond, Flame, Rocket, Sparkles, Trophy, Users, User2, Video, Gamepad, Target } from 'lucide-react';
import { FeedTab } from '@/components/tabs/FeedTab';
import { BattlesTab } from '@/components/tabs/BattlesTab';
import { LiveTab } from '@/components/tabs/LiveTab';
import { ChallengesTab } from '@/components/tabs/ChallengesTab';
import { MatchTab } from '@/components/tabs/MatchTab';
import { ProfileTab } from '@/components/tabs/ProfileTab';
import { StoreTab } from '@/components/tabs/StoreTab';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const trendingTopics = [
  { name: 'IA Generativa', emoji: '🤖', participants: 2547, trending: true },
  { name: 'Sustentabilidade', emoji: '🌱', participants: 1823, trending: true },
  { name: 'ENEM 2025', emoji: '📚', participants: 5621, trending: false },
  { name: 'Programação', emoji: '💻', participants: 3456, trending: true },
  { name: 'Empreendedorismo', emoji: '💡', participants: 1967, trending: false },
];

export function MatchLearnApp(){
  const u = useUser();
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();
  const [loggedIn, setLoggedIn] = useState(false);
  const [sparkles, setSparkles] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [searchInterest, setSearchInterest] = useState('');

  // Popular UserContext com dados da sessão
  useEffect(()=>{
    if(session?.user){
      const id = (session.user as any).id as string;
      const name = (session.user as any).name || u.username;
      if(id){ u.setUserId(id); if(typeof window!=='undefined') localStorage.setItem('userId', id); }
      if(name){ u.setUsername(name); }
      setLoggedIn(true);
      u.refreshInventory();
    }
  },[session]);

  // Salvar carteira conectada para mint on-chain
  useEffect(()=>{
    (async()=>{
      if(isConnected && address && u.userId){
        try{ await fetch('/api/wallet', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: u.userId, address }) }); }catch{}
      }
    })();
  },[isConnected, address, u.userId]);

  const particles = useMemo(() => Array.from({length:20}, (_,i)=>({
    id: i,
    left: Math.random()*100,
    top: Math.random()*100,
    delay: Math.random()*3,
    duration: 3 + Math.random()*2,
    emoji: ['✨','🚀','💎','⚡','🔥'][Math.floor(Math.random()*5)]
  })), []);

  useEffect(()=>{
    const id = setInterval(()=> u.setNotifications(u.notifications + Math.floor(Math.random()*2)), 30000);
    return ()=> clearInterval(id);
  },[u]);

  useEffect(()=>{ if(u.userId) setLoggedIn(true); },[u.userId]);

  const handleLogin = async ()=>{
    if(session?.user){
      setLoggedIn(true);
      setSparkles(true);
      setTimeout(()=> setSparkles(false), 2000);
      u.refreshInventory();
      return;
    }
    if(!u.username.trim() || !u.role) return;
    try{
      const res = await fetch('/api/users', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: u.username }) });
      const data = await res.json();
      if(data?.id){
        u.setUserId(data.id);
        if(typeof window !== 'undefined') localStorage.setItem('userId', data.id);
      }
    }catch(e){ console.error(e); }
    setLoggedIn(true);
    setSparkles(true);
    setTimeout(()=> setSparkles(false), 2000);
    u.refreshInventory();
  };

  const completeDailyChallenge = ()=>{
    u.setStreak(s=> s+1);
    u.setPoints(p=> p+100);
    u.setCoins(c=> c+25);
    if((u.streak+1) % 7 === 0){
      setLevelUp(true);
      u.setLevel(l=> l+1);
      setTimeout(()=> setLevelUp(false), 3000);
    }
    setSparkles(true);
    setTimeout(()=> setSparkles(false), 2000);
  };

  if(!loggedIn){
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {particles.map(p=> (
            <div key={p.id} className="absolute animate-float" style={{ left:`${p.left}%`, top:`${p.top}%`, animationDelay:`${p.delay}s`, animationDuration:`${p.duration}s`}}>
              {p.emoji}
            </div>
          ))}
        </div>
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/10 backdrop-blur-xl text-white relative z-10">
          <CardHeader className="text-center pb-2">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full flex items-center justify-center animate-spin-slow">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-2">Match&Learn</CardTitle>
            <p className="text-purple-200 text-lg">🚀 A revolução do aprendizado</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input placeholder="Digite seu nome de usuário" value={u.username} onChange={e=> u.setUsername(e.target.value)} className="text-center text-lg py-4 bg-white/10 border-white/20 text-white placeholder:text-white/60" />
            <div className="space-y-3">
              <p className="text-sm text-purple-200 text-center">Escolha sua vibe:</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant={u.role==='student' ? 'default' : 'outline'} onClick={()=> u.setRole('student')} className={`flex items-center gap-2 py-3 ${u.role==='student' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
                  Estudante
                </Button>
                <Button variant={u.role==='mentor' ? 'default' : 'outline'} onClick={()=> u.setRole('mentor')} className={`flex items-center gap-2 py-3 ${u.role==='mentor' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
                  Mentor
                </Button>
              </div>
            </div>
            <Button onClick={handleLogin} disabled={!!session?.user ? false : (!u.username.trim() || !u.role)} className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 text-white py-4 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
              {sparkles && <Sparkles className="w-5 h-5 mr-2 animate-spin" />}🚀 Começar a Jornada
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={()=> signIn('google')} className="bg-white text-black hover:bg-gray-100">Entrar com Google</Button>
              <Button variant="secondary" onClick={()=> signIn('apple')} className="bg-white text-black hover:bg-gray-100">Entrar com Apple</Button>
            </div>
            <div className="text-center space-y-2 text-xs text-purple-200">
              <p>• Gamificação viciante • Rewards diários •</p>
              <p>• Battles ao vivo • NFTs educacionais •</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p=> (
          <div key={p.id} className="absolute animate-float" style={{ left:`${p.left}%`, top:`${p.top}%`, animationDelay:`${p.delay}s`, animationDuration:`${p.duration}s`}}>{p.emoji}</div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto p-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">Match&Learn</h1>
                <p className="text-gray-600 flex items-center gap-2">E aí, {u.username}! <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" />{u.streak} dias</span></p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center"><Trophy className="w-5 h-5 text-yellow-500" /><span className="font-bold text-xl">{u.points}</span></div>
                <span className="text-gray-500 text-sm">XP</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center"><Diamond className="w-5 h-5 text-blue-500" /><span className="font-bold text-xl">{u.coins}</span></div>
                <span className="text-gray-500 text-sm">Coins</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center"><Crown className="w-5 h-5 text-purple-500" /><span className="font-bold text-xl">{u.level}</span></div>
                <span className="text-gray-500 text-sm">Level</span>
              </div>
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {u.notifications>0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">{u.notifications}</span>
                  )}
                </Button>
              </div>
              <ConnectButton />
              <div className="w-14 h-14 rounded-full ring-4 ring-purple-200 grid place-items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                {u.username.substring(0,2).toUpperCase()}
              </div>
              {session?.user && (
                <Button variant="outline" onClick={()=> signOut()}>
                  Sair
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="font-bold">Desafio Diário</h3>
                  <p className="text-sm opacity-90">Complete para manter seu streak!</p>
                </div>
              </div>
              <Button onClick={completeDailyChallenge} className="bg-white text-orange-600 hover:bg-orange-50 font-bold">Resgatar +100 XP</Button>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 mb-6 overflow-hidden">
          <div className="flex items-center gap-4 animate-scroll">
            <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">🔥 TRENDING:</span>
            {trendingTopics.map((t,i)=> (
              <Badge key={i} variant={t.trending? 'default':'secondary'} className={`whitespace-nowrap ${t.trending? 'bg-gradient-to-r from-red-500 to-pink-500 text-white': ''}`}>
                {t.emoji} {t.name} ({t.participants})
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-1 border-0">
            <TabsTrigger value="feed" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"><Sparkles className="w-4 h-4 mr-1"/>Feed</TabsTrigger>
            <TabsTrigger value="battles" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"><Gamepad className="w-4 h-4 mr-1"/>Battles</TabsTrigger>
            <TabsTrigger value="live" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"><Video className="w-4 h-4 mr-1"/>Live</TabsTrigger>
            <TabsTrigger value="challenges" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"><Target className="w-4 h-4 mr-1"/>Quest</TabsTrigger>
            <TabsTrigger value="match" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"><Users className="w-4 h-4 mr-1"/>Match</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"><User2 className="w-4 h-4 mr-1"/>Profile</TabsTrigger>
            <TabsTrigger value="store" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"><Diamond className="w-4 h-4 mr-1"/>Store</TabsTrigger>
          </TabsList>

          <TabsContent value="feed"><FeedTab /></TabsContent>
          <TabsContent value="battles"><BattlesTab /></TabsContent>
          <TabsContent value="live"><LiveTab /></TabsContent>
          <TabsContent value="challenges"><ChallengesTab /></TabsContent>
          <TabsContent value="match"><MatchTab searchInterest={searchInterest} setSearchInterest={setSearchInterest}/></TabsContent>
          <TabsContent value="profile"><ProfileTab /></TabsContent>
          <TabsContent value="store"><StoreTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
