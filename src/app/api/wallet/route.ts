import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request){
  const { userId, address } = await req.json();
  if(!userId || !address) return NextResponse.json({ error:'missing params' }, { status:400 });
  await prisma.wallet.upsert({ where:{ userId }, update:{ address }, create:{ userId, address } });
  return NextResponse.json({ ok:true });
}
