import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', { apiVersion: '2024-06-20' as any });

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId as string;
    const kind = session.metadata?.kind as string;
    const packId = Number(session.metadata?.packId || 0);
    const nftId = Number(session.metadata?.nftId || 0);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ ok: false });

    // Salva Stripe customerId para Portal
    const customerId = (session.customer as string) || undefined;
    if (customerId && user.stripeCustomerId !== customerId) {
      await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
    }

    if (kind === 'coins') {
      const packs: Record<number, number> = { 1: 100, 2: 550, 3: 1400, 4: 3000 }; // inclui bônus
      const amount = packs[packId] || 0;
      await prisma.user.update({ where: { id: userId }, data: { coins: { increment: amount } } });
      await prisma.purchase.create({ data: { userId, kind: 'coins', ref: String(packId), amount } });
    }

    if (kind === 'vip') {
      const ends = new Date(); ends.setMonth(ends.getMonth() + 1);
      await prisma.user.update({ where: { id: userId }, data: { isPremium: true, premiumEndsAt: ends } });
      await prisma.purchase.create({ data: { userId, kind: 'vip', ref: 'monthly', amount: 0 } });
    }

    if (kind === 'nft') {
      // 1) registra NFT offchain
      const catalog = [
        { id: 1, name: 'Dragão ENEM Master', price: 500, rarity: 'mythic', uri: 'ipfs://QmDragao' },
        { id: 2, name: 'Cristal da Sabedoria', price: 250, rarity: 'legendary', uri: 'ipfs://QmCristal' },
        { id: 3, name: 'Espada do Coding', price: 300, rarity: 'epic', uri: 'ipfs://QmEspada' },
      ];
      const nft = catalog.find(n => n.id === nftId);
      const inv = await prisma.inventory.upsert({ where: { userId }, create: { userId }, update: {} });
      if (nft) {
        await prisma.nFT.create({ data: { inventoryId: inv.id, name: nft.name, rarity: nft.rarity, price: nft.price, owned: true } });
        await prisma.purchase.create({ data: { userId, kind: 'nft', ref: String(nftId), amount: 0 } });

        // 2) MINT ON-CHAIN (se usuário tiver carteira cadastrada)
        const wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (wallet?.address) {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/nft/mint`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ to: wallet.address, tokenURI: nft.uri })
            });
          } catch (e) { /* log e seguir */ }
        }
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    if (customerId) {
      await prisma.user.updateMany({ where: { stripeCustomerId: customerId }, data: { isPremium: false, premiumEndsAt: null } });
    }
  }

  return NextResponse.json({ received: true });
}
