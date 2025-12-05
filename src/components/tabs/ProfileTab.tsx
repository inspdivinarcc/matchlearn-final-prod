'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';

export function ProfileTab(){
  const u = useUser();
  useEffect(()=>{ u.refreshInventory(); },[]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 ring-4 ring-purple-200 rounded-full grid place-items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold">
                {u.username.substring(0,2).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">Lv.{u.level}</div>
            </div>
            <h3 className="text-xl font-bold mt-4">{u.username}</h3>
            <p className="text-gray-600 capitalize">{u.role||'—'}</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="text-center"><div className="font-bold text-lg">{u.points}</div><div className="text-xs text-gray-500">XP Total</div></div>
              <div className="text-center"><div className="font-bold text-lg">{u.streak}</div><div className="text-xs text-gray-500">Dias Streak</div></div>
              <div className="text-center"><div className="font-bold text-lg">{u.badges.length}</div><div className="text-xs text-gray-500">Badges</div></div>
            </div>
            {u.isPremium && (
              <div className="mt-4">
                <Badge className="bg-yellow-500">VIP ativo • {u.premiumDays} dias</Badge>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold mb-3">Inventário</h4>
            <div className="grid grid-cols-2 gap-3">
              {u.nfts.length===0 && <p className="text-sm text-gray-500 col-span-2">Sem NFTs ainda.</p>}
              {u.nfts.map(n=> (
                <div key={n.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-purple-100 grid place-items-center">{n.rarity==='mythic'?'👑':n.rarity==='legendary'?'💎':'⚔️'}</div>
                    <div>
                      <div className="font-semibold">{n.name}</div>
                      <Badge variant="secondary" className="capitalize">{n.rarity}</Badge>
                    </div>
                  </div>
                  {n.owned ? <Badge className="bg-green-500">POSSUI</Badge> : <Badge variant="outline">Não possui</Badge>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-bold mb-3">Progresso</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Level</span><span>{u.level}/100</span></div>
              <Progress value={(u.level%10)*10} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Streak</span><span>{u.streak} dias</span></div>
              <Progress value={Math.min(100, u.streak)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
