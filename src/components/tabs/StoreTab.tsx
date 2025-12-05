'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { Diamond, Gift, Sparkles, Crown } from 'lucide-react';

const NFT_PRICE_MAP: Record<number, string | undefined> = {
  1: process.env.NEXT_PUBLIC_PRICE_NFT_1,
  2: process.env.NEXT_PUBLIC_PRICE_NFT_2,
  3: process.env.NEXT_PUBLIC_PRICE_NFT_3,
};

export function StoreTab(){
  const u = useUser();
  return (
    <div className="space-y-6">
      {/* Coin Packages */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl"><Diamond className="w-6 h-6"/>💎 Pacotes de Coins</CardTitle>
          <p className="text-blue-100">Compre coins para acelerar seu progresso!</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {u.coinPacks.map(pkg=> (
              <div key={pkg.id} className={`bg-white/10 backdrop-blur-xl rounded-xl p-4 text-center border-2 ${pkg.popular? 'border-yellow-400 relative':'border-transparent'}`}>
                {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">MAIS POPULAR</div>}
                <div className="text-2xl mb-2">💎</div>
                <h4 className="font-bold text-lg">{pkg.coins + pkg.bonus}</h4>
                <p className="text-sm text-blue-100 mb-1">{pkg.coins} + {pkg.bonus} bônus</p>
                <p className="text-xs text-blue-200 mb-3">{pkg.priceBRL}</p>
                <Button size="sm" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold" onClick={async()=>{
                  const r = await fetch('/api/checkout/sessions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ kind:'coins', packId: pkg.id, userId: u.userId }) });
                  const { url } = await r.json(); if(url) window.location.href = url;
                }}>Comprar</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cosméticos */}
        <Card className="border-0 shadow-lg">
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500"/>🎨 Loja de Cosméticos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {u.store.map(item=> (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg grid place-items-center ${item.rarity==='legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : item.rarity==='epic' ? 'bg-gradient-to-r from-purple-400 to-pink-500' : item.rarity==='rare' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' : 'bg-gray-400'}`}>
                    {item.type==='cosmetic'?'👤':item.type==='effect'?'✨':item.type==='background'?'🌌':'⚡'}
                  </div>
                  <div>
                    <h5 className="font-semibold">{item.name}</h5>
                    <Badge variant={item.rarity==='legendary'?'default':item.rarity==='epic'?'secondary':'outline'} className="capitalize">{item.rarity}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{item.price} 💎</p>
                  <Button size="sm" onClick={()=> u.buyItem(item)} disabled={u.coins < item.price} className="mt-1">{u.coins >= item.price ? 'Comprar' : 'Sem coins'}</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* NFTs */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader><CardTitle className="flex items-center gap-2"><Gift className="w-5 h-5 text-pink-500"/>🎭 NFT Marketplace</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[{id:1,name:'Dragão ENEM Master',price:500,rarity:'mythic'},{id:2,name:'Cristal da Sabedoria',price:250,rarity:'legendary'},{id:3,name:'Espada do Coding',price:300,rarity:'epic'}].map((nft:any)=>{
              const owned = u.nfts.some(n=> n.id===nft.id && n.owned);
              const priceId = NFT_PRICE_MAP[nft.id]!; // defina NEXT_PUBLIC_PRICE_NFT_1..3 no .env
              return (
                <div key={nft.id} className={`p-3 rounded-lg border-2 ${owned ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg grid place-items-center ${nft.rarity==='mythic' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : nft.rarity==='legendary' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}>
                        {nft.rarity==='mythic'?'👑':nft.rarity==='legendary'?'💎':'⚔️'}
                      </div>
                      <div>
                        <h5 className="font-semibold">{nft.name}</h5>
                        <Badge className={nft.rarity==='mythic'?'bg-purple-500':nft.rarity==='legendary'?'bg-yellow-500':'bg-blue-500'}>{nft.rarity}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      {owned ? (
                        <Badge className="bg-green-500 text-white">POSSUI</Badge>
                      ) : (
                        <>
                          <p className="font-bold text-purple-600">{nft.price} 💎</p>
                          <Button size="sm" onClick={async()=>{
                            const r = await fetch('/api/checkout/sessions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ kind:'nft', userId: u.userId, nftId: nft.id, priceId }) });
                            const { url } = await r.json(); if(url) window.location.href = url;
                          }} disabled={!priceId} className="mt-1">{priceId ? 'Comprar NFT' : 'Configure o priceId'}</Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* VIP */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full grid place-items-center"><Crown className="w-8 h-8"/></div>
              <div>
                <h2 className="text-2xl font-bold mb-2">👑 Match&Learn VIP</h2>
                <ul className="text-sm space-y-1 text-yellow-100">
                  <li>✅ XP duplo em todos os desafios</li>
                  <li>✅ Coins extras diários (+50 por dia)</li>
                  <li>✅ Acesso antecipado a battles e NFTs</li>
                  <li>✅ Sem anúncios + Skin VIP exclusiva</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              {u.isPremium ? (
                <div className="text-center space-y-2">
                  <Badge className="bg-white text-orange-600 text-lg px-4 py-2">✅ VIP ATIVO</Badge>
                  <p className="text-sm">{u.premiumDays} dias restantes</p>
                  <Button className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6"
                    onClick={async()=>{
                      const r = await fetch('/api/stripe/portal', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: u.userId }) });
                      const { url } = await r.json(); if(url) window.location.href = url;
                    }}
                  >Gerenciar Assinatura</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg px-8 py-3" onClick={async()=>{
                    const r = await fetch('/api/checkout/sessions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ kind:'vip', userId: u.userId }) });
                    const { url } = await r.json(); if(url) window.location.href = url;
                  }}>Assinar VIP</Button>
                  <p className="text-sm text-yellow-100">A partir de R$ 19,90/mês</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
