import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request){
  const body = await req.json();
  const { kind, packId, priceId, userId, nftId } = body || {};
  if(!userId) return NextResponse.json({ error:'missing userId' }, { status:400 });

  const success_url = `${process.env.NEXT_PUBLIC_APP_URL}/?success=1`;
  const cancel_url = `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=1`;

  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if(kind === 'coins'){
    const map: Record<number, string> = {
      1: process.env.STRIPE_PRICE_COINS_100!,
      2: process.env.STRIPE_PRICE_COINS_500!,
      3: process.env.STRIPE_PRICE_COINS_1200!,
      4: process.env.STRIPE_PRICE_COINS_2500!,
    };
    const price = map[packId as number];
    if(!price) return NextResponse.json({ error:'invalid packId' }, { status:400 });
    lineItems = [{ price, quantity: 1 }];
  }

  if(kind === 'vip'){
    lineItems = [{ price: process.env.STRIPE_PRICE_VIP_MONTHLY!, quantity: 1 }];
  }

  if(kind === 'nft'){
    if(!priceId) return NextResponse.json({ error:'missing priceId' }, { status:400 });
    lineItems = [{ price: priceId, quantity: 1 }];
  }

  const session = await stripe.checkout.sessions.create({
    mode: kind === 'vip' ? 'subscription' : 'payment',
    line_items: lineItems,
    success_url,
    cancel_url,
    metadata: { userId: String(userId), kind: String(kind||''), packId: String(packId||''), nftId: String(nftId||'') },
  });

  return NextResponse.json({ id: session.id, url: session.url });
}
