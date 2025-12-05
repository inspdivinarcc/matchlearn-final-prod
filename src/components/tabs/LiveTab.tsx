'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Play } from "lucide-react";

const liveStreams = [
  { id:1, mentor:'Prof. Ana Tech', title:'Como criar Apps com IA em 30min', viewers:1247, duration:'28:45', thumbnail:'🤖', category:'Tech', live:true },
  { id:2, mentor:'Dra. Climate', title:'Soluções Eco para o Futuro', viewers:892, duration:'15:20', thumbnail:'🌍', category:'Sustentabilidade', live:true },
  { id:3, mentor:'Master ENEM', title:'Redação 1000 - Segredos', viewers:2156, duration:'42:10', thumbnail:'✍️', category:'ENEM', live:false },
];

export function LiveTab(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {liveStreams.map(s => (
        <Card key={s.id} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 grid place-items-center text-6xl">{s.thumbnail}</div>
            {s.live && <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">🔴 AO VIVO</div>}
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">{s.duration}</div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs"><Eye className="w-3 h-3" />{s.viewers}</div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">{s.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{s.mentor}</p>
            <div className="flex items-center justify-between"><Badge variant="secondary">{s.category}</Badge><Button size="sm" className="bg-green-500 hover:bg-green-600 text-white"><Play className="w-4 h-4 mr-1"/>Assistir</Button></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
