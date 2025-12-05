'use server';

import prisma from '@/lib/prisma';

const INITIAL_CONTENT = [
    {
        title: 'Introdução ao Next.js',
        type: 'article',
        description: 'Aprenda os conceitos básicos do framework React mais popular.',
        body: 'Next.js é um framework React que permite funcionalidades como renderização do lado do servidor e geração de sites estáticos...',
        xpReward: 50,
        coinsReward: 10,
    },
    {
        title: 'Desafio de Server Actions',
        type: 'challenge',
        description: 'Teste seus conhecimentos sobre mutações de dados no servidor.',
        body: 'Responda as perguntas corretamente para ganhar recompensas extras.',
        xpReward: 100,
        coinsReward: 25,
    },
    {
        title: 'O que é Web3?',
        type: 'video',
        description: 'Entenda como a blockchain está mudando a internet.',
        body: 'https://youtube.com/watch?v=example',
        xpReward: 30,
        coinsReward: 5,
    },
    {
        title: 'Quiz de TypeScript',
        type: 'quiz',
        description: 'Verifique se você domina a tipagem estática.',
        body: 'Perguntas sobre interfaces, types e generics.',
        xpReward: 75,
        coinsReward: 15,
    },
];

export async function seedInitialContent() {
    try {
        const count = await prisma.content.count();
        if (count > 0) {
            return { success: true, message: 'Content already seeded.' };
        }

        for (const item of INITIAL_CONTENT) {
            await prisma.content.create({
                data: item,
            });
        }

        return { success: true, message: `Seeded ${INITIAL_CONTENT.length} items.` };
    } catch (error) {
        console.error('Error seeding content:', error);
        return { success: false, error: 'Failed to seed content.' };
    }
}
