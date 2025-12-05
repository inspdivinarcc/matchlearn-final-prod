'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crown, Flame } from "lucide-react";

export function ChallengesTab(){
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎯 Quest Diária</h2>
              <p className="text-blue-100">Complete 3 desafios para desbloquear o baú épico!</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <Progress value={66} className="w-24 bg-white/20" />
              <p className="text-sm mt-1">2/3 completos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500"/>Desafios Diários</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded flex items-center justify-between"><span className="text-sm">✅ Quiz de Matemática</span><Badge className="bg-green-500">+50 XP</Badge></div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded flex items-center justify-between"><span className="text-sm">🔄 Redação em 30min</span><Badge variant="outline">75 XP</Badge></div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded flex items-center justify-between"><span className="text-sm">⏳ Código Python</span><Badge variant="outline">100 XP</Badge></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5 text-purple-500"/>Boss Semanal</CardTitle></CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl mb-4">🐉</div>
              <h3 className="font-bold text-lg mb-2">Dragão do ENEM</h3>
              <p className="text-sm text-gray-600 mb-4">Prove que está pronto para o vestibular!</p>
              <Progress value={30} className="mb-3" />
              <div className="flex items-center justify-between text-sm mb-4"><span>HP: 70/100</span><span>Reward: 1000 XP + NFT</span></div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">⚔️ Desafiar Boss</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
