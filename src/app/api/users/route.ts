import { NextResponse } from "next/server";
import { db } from "@/server/db";
export async function POST(req: Request){
  const body = await req.json().catch(()=>null) as { username?: string } | null;
  const username = body?.username?.trim();
  if(!username) return NextResponse.json({ error: "username required" }, { status: 400 });
  let user = db.users.find((u:any)=> u.username?.toLowerCase?.()===username.toLowerCase());
  if(!user){
    user = { id: "u_"+Date.now().toString(36), username, coins: 450, isPremium: false, premiumDays: 0 };
    db.users.push(user);
    db.inventories.push({ userId: user.id, nfts: [] });
  }
  return NextResponse.json({ id: user.id, username });
}
