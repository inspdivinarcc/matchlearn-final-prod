'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Share2, Heart, Star } from "lucide-react";
import { useMemo, useState } from "react";

const socialFeed = [
  { id:1, user:'Ana Silva', avatar:'AS', action:'completou o desafio', content:'Criei meu primeiro chatbot! 🤖✨', challenge:'IA para Iniciantes', points:150, likes:47, comments:12, timeAgo:'2min', media:'🎥' },
  { id:2, user:'Lucas Code', avatar:'LC', action:'alcançou streak de', content:'30 dias consecutivos estudando! 🔥', points:300, likes:89, comments:23, timeAgo:'5min', media:'📊' },
  { id:3, user:'Maria Eco', avatar:'ME', action:'venceu a battle', content:'Sustentabilidade Urbana 🌱🏙️', challenge:'EcoChallenge', points:200, likes:156, comments:34, timeAgo:'12min', media:'🎬' },
];

export function FeedTab(){
  const [feedLikes, setLikes] = useState<Record<number, number>>({});
  const posts = useMemo(()=> socialFeed, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map(post=> (
        <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="ring-2 ring-purple-200"><AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">{post.avatar}</AvatarFallback></Avatar>
                  <div>
                    <h4 className="font-bold text-sm">{post.user}</h4>
                    <p className="text-xs text-gray-500">{post.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{post.timeAgo}</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">{post.media}</div>
              <div className="absolute top-2 right-2"><Badge className="bg-yellow-500 text-white">+{post.points} XP</Badge></div>
            </div>
            <div className="p-4">
              <p className="font-medium mb-3">{post.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-red-500" onClick={()=> setLikes(prev=> ({...prev, [post.id]: (prev[post.id]||0)+1}))}>
                    <Heart className={`w-4 h-4 ${feedLikes[post.id] ? 'fill-red-500 text-red-500':''}`} />
                    {post.likes + (feedLikes[post.id]||0)}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{post.comments}</Button>
                  <Button variant="ghost" size="sm"><Share2 className="w-4 h-4" /></Button>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1"><Star className="w-4 h-4"/>Inspirar</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
