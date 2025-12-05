'use client';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';

export type Role = 'student' | 'mentor' | '';
export type Rarity = 'common'|'rare'|'epic'|'legendary'|'mythic';
export type NFT = { id: number; name: string; price: number; rarity: Rarity; owned?: boolean };
export type StoreItem = { id:number; name:string; price:number; type:'cosmetic'|'effect'|'background'|'boost'; rarity:Rarity };
export type CoinPackage = { id:number; coins:number; priceBRL:string; bonus:number; popular?:boolean };

export type UserState = {
  username: string; setUsername: (s: string)=>void;
  role: Role; setRole: (r:Role)=>void;
  points: number; setPoints:(n:number|((p:number)=>number))=>void;
  coins: number; setCoins:(n:number|((c:number)=>number))=>void;
  streak: number; setStreak:(n:number|((s:number)=>number))=>void;
  level: number; setLevel:(n:number|((l:number)=>number))=>void;
  badges: string[]; setBadges:(b:string[])=>void;
  notifications: number; setNotifications:(n:number)=>void;
  isPremium: boolean; setIsPremium:(b:boolean)=>void;
  premiumDays: number; setPremiumDays:(n:number)=>void;
  battlePass: { tier:number; premium:boolean }; setBattlePass:(b:{tier:number; premium:boolean})=>void;
  nfts: NFT[]; setNfts:(l:NFT[])=>void;
  store: StoreItem[];
  coinPacks: CoinPackage[];
  nftMode: 'offchain'|'onchain'; setNftMode:(m:'offchain'|'onchain')=>void;
  userId: string | null; setUserId:(id:string|null)=>void;
  buyCoins: (pkg: CoinPackage)=>Promise<void>;
  buyItem: (item: StoreItem)=>Promise<void>;
  buyNFT: (nft: NFT)=>Promise<void>;
  refreshInventory: ()=>Promise<void>;
};

const defaultState: UserState = {
  username: '', setUsername: ()=>{},
  role: '', setRole: ()=>{},
  points: 1780, setPoints: ()=>{},
  coins: 450, setCoins: ()=>{},
  streak: 7, setStreak: ()=>{},
  level: 12, setLevel: ()=>{},
  badges: ['🎯 Focado','🚀 Iniciante','🔥 Streak'], setBadges: ()=>{},
  notifications: 3, setNotifications: ()=>{},
  isPremium: false, setIsPremium: ()=>{},
  premiumDays: 0, setPremiumDays: ()=>{},
  battlePass: { tier:0, premium:false }, setBattlePass: ()=>{},
  nfts: [], setNfts: ()=>{},
  store: [], coinPacks: [],
  nftMode: 'offchain', setNftMode: ()=>{},
  userId: null, setUserId: ()=>{},
  buyCoins: async()=>{}, buyItem: async()=>{}, buyNFT: async()=>{},
  refreshInventory: async()=>{},
};

const Ctx = createContext<UserState>(defaultState);
export const useUser = ()=> useContext(Ctx);

export function UserProvider({ children }: { children: React.ReactNode }){
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>('');
  const [points, setPoints] = useState(1780);
  const [coins, setCoins] = useState(450);
  const [streak, setStreak] = useState(7);
  const [level, setLevel] = useState(12);
  const [badges, setBadges] = useState<string[]>(['🎯 Focado','🚀 Iniciante','🔥 Streak']);
  const [notifications, setNotifications] = useState(3);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumDays, setPremiumDays] = useState(0);
  const [battlePass, setBattlePass] = useState({ tier:0, premium:false });
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [nftMode, setNftMode] = useState<'offchain'|'onchain'>('offchain');
  const [userId, setUserId] = useState<string|null>(null);

  const store: StoreItem[] = useMemo(()=>[
    { id:1, name:'Avatar Cyberpunk', price:150, type:'cosmetic', rarity:'epic' },
    { id:2, name:'Efeito Fogo', price:75, type:'effect', rarity:'rare' },
    { id:3, name:'Background Galaxia', price:200, type:'background', rarity:'legendary' },
    { id:4, name:'Double XP 24h', price:100, type:'boost', rarity:'common' },
  ],[]);

  const coinPacks: CoinPackage[] = useMemo(()=>[
    { id:1, coins:100, priceBRL:'R$ 4,99', bonus:0 },
    { id:2, coins:500, priceBRL:'R$ 19,99', bonus:50, popular:true },
    { id:3, coins:1200, priceBRL:'R$ 39,99', bonus:200 },
    { id:4, coins:2500, priceBRL:'R$ 79,99', bonus:500 },
  ],[]);

  useEffect(()=>{
    const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if(id) setUserId(id);
  },[]);

  const refreshInventory = async()=>{
    if(!userId) return;
    try{
      const res = await fetch(`/api/inventory?userId=${userId}`, { cache:'no-store' });
      if(!res.ok) return;
      const data = await res.json();
      if(Array.isArray(data.nfts)) setNfts(data.nfts);
      if(typeof data.coins === 'number') setCoins(data.coins);
      if(typeof data.isPremium === 'boolean') setIsPremium(data.isPremium);
      if(typeof data.premiumDays === 'number') setPremiumDays(data.premiumDays);
    }catch(e){ console.error(e); }
  };

  const buyCoins = async (pkg: CoinPackage)=>{
    setCoins(c=> c + pkg.coins + pkg.bonus);
    try{
      await fetch('/api/checkout/sessions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ kind:'coins', packId: pkg.id, userId }) });
    }catch{ /* noop */ }
  };

  const buyItem = async (item: StoreItem)=>{
    setCoins(c=> c - item.price);
    try{
      await fetch('/api/inventory', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId, type:'item', item }) });
    }catch{}
  };

  const buyNFT = async (nft: NFT)=>{
    setCoins(c=> c - nft.price);
    setNfts(list => list.some(n=>n.id===nft.id) ? list.map(n=> n.id===nft.id? {...n, owned:true}:n) : [...list, { ...nft, owned:true }]);
    try{
      await fetch('/api/checkout/sessions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ kind:'nft', nftId: nft.id, userId, nftMode }) });
      await refreshInventory();
    }catch{}
  };

  const value: UserState = {
    username, setUsername,
    role, setRole,
    points, setPoints,
    coins, setCoins,
    streak, setStreak,
    level, setLevel,
    badges, setBadges,
    notifications, setNotifications,
    isPremium, setIsPremium,
    premiumDays, setPremiumDays,
    battlePass, setBattlePass,
    nfts, setNfts,
    store, coinPacks,
    nftMode, setNftMode,
    userId, setUserId,
    buyCoins, buyItem, buyNFT,
    refreshInventory,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
