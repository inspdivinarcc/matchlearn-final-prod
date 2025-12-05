'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MatchTab({ searchInterest, setSearchInterest }: { searchInterest:string; setSearchInterest:(s:string)=>void }){
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-6">
          <Input placeholder="Digite um interesse (ex: IA, ENEM, Matemática...)" value={searchInterest} onChange={e=> setSearchInterest(e.target.value)} className="flex-1" />
          <Button>Buscar</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{e:'🤖',t:'IA & Tech',o:347},{e:'📚',t:'ENEM 2025',o:892},{e:'🌱',t:'Sustentabilidade',o:234}].map((c,i)=> (
            <Card key={i} className="border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-3">{c.e}</div>
                <h4 className="font-bold mb-2">{c.t}</h4>
                <p className="text-sm text-gray-600 mb-3">{c.o} pessoas online</p>
                <Button size="sm" className="w-full">Match Rápido</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
