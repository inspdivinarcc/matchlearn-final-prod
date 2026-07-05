const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── QuestionBank ──
  const qCount = await prisma.questionBank.count();
  if (qCount === 0) {
    await prisma.questionBank.createMany({
      data: [
        {
          question: 'Qual hook do React é ideal para otimizar funções pesadas evitando sua recriação?',
          options: JSON.stringify(['useMemo', 'useCallback', 'useEffect', 'useRef']),
          correctAnswerIndex: 1,
          subject: 'React',
          difficulty: 'Medium',
        },
        {
          question: 'O que faz o modificador "readonly" no TypeScript?',
          options: JSON.stringify([
            'Permite alterar a propriedade apenas dentro da classe',
            'Torna a propriedade imutável após a inicialização',
            'Deixa o valor oculto para o usuário final',
            'Cria constantes globais no escopo',
          ]),
          correctAnswerIndex: 1,
          subject: 'TypeScript',
          difficulty: 'Easy',
        },
        {
          question: 'Qual a principal vantagem do Edge Runtime no Next.js?',
          options: JSON.stringify([
            'Acesso ilimitado a APIs nativas do Node.js',
            'Menor latência global executando próximo ao usuário',
            'Compatibilidade total com Docker',
            'Encriptação AES nativa no compilador',
          ]),
          correctAnswerIndex: 1,
          subject: 'Next.js',
          difficulty: 'Hard',
        },
        {
          question: 'Qual é a diferença entre "interface" e "type" no TypeScript?',
          options: JSON.stringify([
            'Não há diferença alguma',
            'Interface suporta declaração merge, type não',
            'Type é mais rápido que interface',
            'Interface só funciona com classes',
          ]),
          correctAnswerIndex: 1,
          subject: 'TypeScript',
          difficulty: 'Medium',
        },
        {
          question: 'O que é Server-Side Rendering (SSR)?',
          options: JSON.stringify([
            'Renderização no navegador do usuário',
            'Renderização no servidor a cada requisição',
            'Cache estático de páginas',
            'Renderização via WebSocket',
          ]),
          correctAnswerIndex: 1,
          subject: 'Next.js',
          difficulty: 'Easy',
        },
        {
          question: 'Qual padrão de design o React usa internamente para gerenciar estado?',
          options: JSON.stringify([
            'Singleton',
            'Observer',
            'Factory',
            'Adapter',
          ]),
          correctAnswerIndex: 1,
          subject: 'React',
          difficulty: 'Hard',
        },
      ],
    });
    console.log('✅ QuestionBank seeded (6 questions)');
  } else {
    console.log(`⏭️  QuestionBank already has ${qCount} questions, skipping.`);
  }

  // ── Content ──
  const cCount = await prisma.content.count();
  if (cCount === 0) {
    await prisma.content.createMany({
      data: [
        {
          title: 'Introdução ao Next.js',
          type: 'article',
          description: 'Aprenda os conceitos básicos do framework React mais popular.',
          body: 'Next.js é um framework React que permite funcionalidades como renderização do lado do servidor e geração de sites estáticos.',
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
      ],
    });
    console.log('✅ Content seeded (4 items)');
  } else {
    console.log(`⏭️  Content already has ${cCount} items, skipping.`);
  }

  // ── Gigs (check if already seeded) ──
  const gCount = await prisma.gig.count();
  if (gCount === 0) {
    await prisma.gig.createMany({
      data: [
        {
          title: 'Develop Smart Contracts on Sepolia',
          description: 'Create and deploy secure ERC20/ERC721 smart contracts for Trinity Protocol.',
          reward: 150,
          difficulty: 'Hard',
          type: 'Security',
          timeEstimate: '4h',
        },
        {
          title: 'Implement Responsive Navbar',
          description: 'Clean up mobile navigation for the main dashboard layout.',
          reward: 40,
          difficulty: 'Easy',
          type: 'Frontend',
          timeEstimate: '1h',
        },
        {
          title: 'Optimize Database Queries',
          description: 'Review Prisma schemas, indexes, and pagination for the Social Hub feed.',
          reward: 80,
          difficulty: 'Medium',
          type: 'Backend',
          timeEstimate: '2.5h',
        },
      ],
    });
    console.log('✅ Gigs seeded (3 gigs)');
  } else {
    console.log(`⏭️  Gigs already has ${gCount} items, skipping.`);
  }

  // ── Give the admin user some starting coins ──
  const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (adminUser && adminUser.coins === 0) {
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { coins: 500, xp: 250, level: 3 },
    });
    console.log('✅ Admin user given 500 coins, 250 XP, level 3');
  }

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
