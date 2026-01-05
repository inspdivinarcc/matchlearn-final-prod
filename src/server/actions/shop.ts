'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const SHOP_ITEMS = [
    { id: 'xp_boost_1h', name: 'XP Boost (1h)', price: 100, type: 'consumable', description: 'Dobra seu XP por 1 hora.' },
    { id: 'skin_neon', name: 'Skin Neon', price: 500, type: 'skin', description: 'Visual exclusivo para seu avatar.' },
    { id: 'loot_box_common', name: 'Caixa Comum', price: 50, type: 'lootbox', description: 'Contém itens aleatórios.' },
    { id: 'mentorship_pass', name: 'Passe de Mentoria', price: 300, type: 'service', description: '1 sessão de 30min com Mentor.' },
    { id: 'badge_early', name: 'Badge Early Adopter', price: 1000, type: 'badge', description: 'Mostre que você chegou cedo.' },
    { id: 'frame_gold', name: 'Moldura Dourada', price: 750, type: 'cosmetic', description: 'Destaque sua foto de perfil.' },
];

export async function getShopItems() {
    return SHOP_ITEMS;
}

export async function buyItem(itemId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
        return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;
    const item = SHOP_ITEMS.find((i) => i.id === itemId);

    if (!item) {
        return { success: false, error: 'Item not found' };
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.coins < item.price) {
            return { success: false, error: 'Insufficient coins' };
        }

        // Deduct coins
        await prisma.user.update({
            where: { id: userId },
            data: { coins: { decrement: item.price } },
        });

        // Add to inventory
        let inventory = await prisma.inventory.findUnique({ where: { userId } });
        if (!inventory) {
            inventory = await prisma.inventory.create({ data: { userId } });
        }

        // For now, we treat everything as an NFT/Item in the DB
        await prisma.nFT.create({
            data: {
                inventoryId: inventory.id,
                name: item.name,
                rarity: 'Common', // Default
                price: item.price,
                tokenId: Math.floor(Math.random() * 100000), // Mock token ID
            },
        });

        revalidatePath('/marketplace');
        revalidatePath('/inventory');
        revalidatePath('/home');

        return { success: true, message: `Bought ${item.name}!` };
    } catch (error) {
        console.error('Error buying item:', error);
        return { success: false, error: 'Failed to process purchase.' };
    }
}
