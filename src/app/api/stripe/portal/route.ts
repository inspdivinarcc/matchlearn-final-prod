import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request){
  const { userId } = await req.json();
  if(!userId) return NextResponse.json({ error:'missing userId' }, { status:400 });

  const user = await prisma.user.findUnique({ where:{ id:userId } });
  if(!user?.stripeCustomerId) return NextResponse.json({ error:'no stripe customer' }, { status:400 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: process.env.NEXT_PUBLIC_APP_URL!,
  });
  return NextResponse.json({ url: portal.url });
}
