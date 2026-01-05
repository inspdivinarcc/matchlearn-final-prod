const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
    {
        title: 'Design System com Tailwind',
        type: 'article',
        description: 'Como criar interfaces consistentes e bonitas rapidamente.',
        body: 'Utility-first CSS é o futuro...',
        xpReward: 40,
        coinsReward: 8,
    },
    {
        title: 'Smart Contracts 101',
        type: 'video',
        description: 'Aprenda a lógica por trás do Ethereum.',
        body: 'https://youtube.com/watch?v=example2',
        xpReward: 60,
        coinsReward: 12,
    },
    {
        title: 'Desafio de Algoritmos',
        type: 'challenge',
        description: 'Resolva problemas de lógica de programação.',
        body: 'Ordenação, busca e estruturas de dados.',
        xpReward: 120,
        coinsReward: 30,
    },
    {
        title: 'React Hooks Avançados',
        type: 'article',
        description: 'Domine useMemo, useCallback e useRef.',
        body: 'Otimizando performance no React...',
        xpReward: 55,
        coinsReward: 10,
    }
];

async function main() {
    console.log('Start seeding...');

    // 1. Content
    for (const item of INITIAL_CONTENT) {
        const exists = await prisma.content.findFirst({
            where: { title: item.title }
        });

        if (!exists) {
            await prisma.content.create({
                data: item,
            });
            console.log(`Created content: ${item.title}`);
        }
    }

    // 2. Create a dummy user for social interactions if not exists
    let botUser = await prisma.user.findUnique({ where: { email: 'bot@matchlearn.com' } });
    if (!botUser) {
        botUser = await prisma.user.create({
            data: {
                email: 'bot@matchlearn.com',
                username: 'MatchLearn Bot',
                image: 'https://api.dicebear.com/7.x/bottts/svg?seed=MatchLearn',
                coins: 9999,
                level: 10,
                bio: 'Sou um bot especializado em ensinar de forma Visual e Prática.',
                vakVisual: 80,
                vakAuditory: 20,
                vakKinesthetic: 90,
                learningStyle: 'KINESTHETIC'
            }
        });
        console.log('Created Bot User');
    } else {
        await prisma.user.update({
            where: { email: 'bot@matchlearn.com' },
            data: {
                bio: 'Sou um bot especializado em ensinar de forma Visual e Prática.',
                vakVisual: 80,
                vakAuditory: 20,
                vakKinesthetic: 90,
                learningStyle: 'KINESTHETIC'
            }
        });
        console.log('Updated Bot User VAK profile');
    }

    // 3. Social Posts
    const posts = [
        { content: 'Acabei de completar o desafio de Next.js! 🚀 #learning #nextjs', imageUrl: null },
        { content: 'Alguém quer formar time para o hackathon de Web3?', imageUrl: null },
        { content: 'Olhem esse design que fiz usando TailwindCSS!', imageUrl: null },
    ];

    for (const post of posts) {
        await prisma.post.create({
            data: {
                ...post,
                authorId: botUser.id,
            }
        });
        console.log(`Created post: ${post.content.substring(0, 20)}...`);
    }

    // 4. Projects
    const projects = [
        {
            name: 'DeFi Dashboard',
            description: 'Um dashboard para visualizar investimentos em DeFi. Preciso de ajuda com a integração da API da CoinGecko.',
            tags: JSON.stringify(['React', 'Web3', 'API']),
        },
        {
            name: 'Clone do Twitter',
            description: 'Recriando o Twitter para aprender arquitetura de microserviços.',
            tags: JSON.stringify(['Next.js', 'Prisma', 'PostgreSQL']),
        }
    ];

    for (const project of projects) {
        await prisma.project.create({
            data: {
                ...project,
                ownerId: botUser.id,
                members: {
                    create: {
                        userId: botUser.id,
                        role: 'owner'
                    }
                }
            }
        });
        console.log(`Created project: ${project.name}`);
    }

    // 5. Transactions (Wallet)
    const transactions = [
        { amount: 50.0, currency: 'USD', type: 'EARN', description: 'Mentoria React Basics' },
        { amount: 250, currency: 'COIN', type: 'EARN', description: 'Quest Diária' },
        { amount: 10.0, currency: 'USD', type: 'SPEND', description: 'Compra de Skin' },
        { amount: 100.0, currency: 'USD', type: 'WITHDRAW', description: 'Saque para PayPal' },
    ];

    for (const tx of transactions) {
        await prisma.transaction.create({
            data: {
                ...tx,
                userId: botUser.id,
            }
        });
        console.log(`Created transaction: ${tx.description}`);
    }

    // 6. Gigs (Trinity Board)
    const gigs = [
        {
            title: 'Audit DeFi Protocol',
            description: 'Audit smart contracts for reentrancy vulnerabilities.',
            reward: 5000,
            difficulty: 'Hard',
            type: 'Security',
            timeEstimate: '4h',
            status: 'OPEN'
        },
        {
            title: 'Frontend React Component',
            description: 'Create a reusable liquidity pool widget.',
            reward: 1200,
            difficulty: 'Medium',
            type: 'Frontend',
            timeEstimate: '2d',
            status: 'OPEN'
        },
        {
            title: 'Zero-Knowledge R&D',
            description: 'Research implementation of zk-SNARKs for user privacy.',
            reward: 8500,
            difficulty: 'Hard',
            type: 'Cryptography',
            timeEstimate: '5d',
            status: 'OPEN'
        },
        {
            title: 'Data Analytics Dashboard',
            description: 'Visualize on-chain data using Recharts.',
            reward: 3400,
            difficulty: 'Medium',
            type: 'Data Science',
            timeEstimate: '3d',
            status: 'OPEN'
        },
    ];

    for (const gig of gigs) {
        await prisma.gig.create({ data: gig });
        console.log(`Created gig: ${gig.title}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
