'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Diamond } from "lucide-react";

const battleRooms = [
  { id:1, title:'Quiz Relâmpago - Matemática', players:'8/8', prize:'500 coins', difficulty:'Médio', timeLeft:'2min', status:'live', category:'math' },
  { id:2, title:'Coding Challenge - Python', players:'6/10', prize:'750 coins', difficulty:'Hard', timeLeft:'15min', status:'joining', category:'tech' },
  { id:3, title:'Redação Speed - ENEM', players:'4/12', prize:'400 coins', difficulty:'Fácil', timeLeft:'5min', status:'joining', category:'language' },
];

export function BattlesTab(){
  const join = (id:number)=>{ console.log('join battle', id); };
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full grid place-items-center text-2xl">🏆</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">Campeonato Universitário</h2>
                  <Badge className="bg-red-500 text-white animate-pulse">PATROCINADO</Badge>
                </div>
                <p className="text-green-100 mb-2">Competição nacional com as melhores universidades do Brasil</p>
                <div className="flex gap-4 text-sm"><span>🎯 Prêmio: R$ 10.000 + Bolsas de estudo</span><span>📅 Inscrições até: 30/07</span></div>
              </div>
            </div>
            <div className="text-center">
              <Button className="bg-white text-green-600 hover:bg-green-50 font-bold px-6 py-3">Inscrever-se</Button>
              <p className="text-xs text-green-200 mt-1">Apenas 50 coins</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {battleRooms.map(b => (
          <Card key={b.id} className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={b.status==='live' ? 'destructive' : 'secondary'} className="animate-pulse">{b.status==='live' ? '🔴 AO VIVO' : '🟡 ENTRANDO'}</Badge>
                <span className="text-sm font-bold text-red-600">{b.timeLeft}</span>
              </div>
              <CardTitle className="text-lg">{b.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm"><span>Jogadores: <strong>{b.players}</strong></span><Badge variant="outline">{b.difficulty}</Badge></div>
                <div className="flex items-center gap-2"><Diamond className="w-4 h-4 text-blue-500" /><span className="font-bold text-blue-600">{b.prize}</span></div>
                <Button onClick={()=> join(b.id)} className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" disabled={b.status==='live'}>{b.status==='live' ? '🔴 Em Andamento' : '⚔️ Entrar na Battle'}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
