import { NextResponse } from 'next/server';

// Stub: apenas confirma que recebeu (sem Stripe real)
export async function POST(req: Request){
  const body = await req.json();
  return NextResponse.json({ ok:true, received: body });
}
