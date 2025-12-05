# Match&Learn - Master Guide 📘

## 1. Visão Geral do Projeto
**Match&Learn** é uma plataforma de educação gamificada que utiliza **Web3 Invisível** para recompensar o aprendizado. O objetivo é tornar o estudo viciante como um jogo, onde o progresso (XP) e as conquistas (Badges) são ativos reais (NFTs) na blockchain, mas sem a complexidade técnica para o usuário final.

### Diferenciais
-   **Invisible Web3**: O usuário não precisa instalar MetaMask. Uma carteira é criada automaticamente no cadastro.
-   **Gamificação Real**: XP e Moedas não são apenas números no banco de dados, são tokens que podem ter valor real.
-   **Ciclo de Engajamento**: Aprender (Feed) -> Batalhar (Arena) -> Ganhar (Coins/XP) -> Gastar (Marketplace).

---

## 2. Arquitetura Técnica
-   **Frontend**: Next.js 15 (App Router), TailwindCSS, Shadcn/ui.
-   **Backend**: Server Actions (Next.js), Prisma ORM.
-   **Database**: PostgreSQL (Supabase/Neon).
-   **Auth**: NextAuth.js (Google/Credentials).
-   **Web3**: Viem (interação com Blockchain), Private Key Management (Server-side).

---

## 3. Guia de Testes (Como Rodar) 🧪

### Pré-requisitos
-   Node.js 18+ instalado.
-   PostgreSQL rodando (local ou nuvem).
-   Arquivo `.env` configurado (ver `DEPLOY.md`).

### Passo a Passo

#### 1. Instalação
```bash
npm install
npx prisma generate
npx prisma migrate dev
```

#### 2. Rodar o Projeto
```bash
npm run dev
```
Acesse `http://localhost:3000`.

#### 3. Testando o Fluxo do Usuário (User Journey)

**A. Cadastro e Wallet**
1.  Crie uma conta nova.
2.  Observe no canto superior direito (ou no Admin) que uma carteira (0x...) foi criada automaticamente.

**B. Jornada do Herói (Feed)**
1.  Na Home, clique em "Seed Content" (botão de dev) se a lista estiver vazia.
2.  Clique em "Começar" em uma missão.
3.  Simule a conclusão (o sistema adicionará XP).

**C. Arena de Batalha**
1.  Vá para a aba **Arena**.
2.  Clique em "Entrar na Arena".
3.  Responda a pergunta da IA (simulada).
4.  **Vitória**: Verifique se ganhou Coins e XP.
5.  **Derrota**: Tente novamente.

**D. Marketplace**
1.  Vá para a aba **Marketplace**.
2.  Tente comprar um item caro (sem saldo) -> Deve ver um erro (Toast vermelho).
3.  Jogue na Arena até ter moedas.
4.  Compre um item -> Deve ver sucesso (Toast verde) e saldo diminuir.

**E. Admin**
1.  Acesse `http://localhost:3000/admin`.
2.  Veja seu usuário na lista, seu saldo atualizado e nível.

---

## 4. Estratégias de Monetização 💰

Como transformar o Match&Learn em um negócio lucrativo?

### Modelo 1: Freemium (B2C)
-   **Grátis**: Acesso a aulas básicas e 3 batalhas por dia.
-   **Premium (R$ 29,90/mês)**:
    -   Batalhas ilimitadas.
    -   Acesso a cursos avançados.
    -   **XP em Dobro** (acelera o ganho de tokens).
    -   Badge exclusiva "Pro Player" (NFT).

### Modelo 2: Marketplace de Ativos (Web3 Economy)
-   **Venda de Itens**: Skins para o perfil, "Pochões de Energia", "Escudos de Streak".
-   **Taxa de Transação**: Se no futuro os usuários puderem vender itens entre si, a plataforma cobra 5% de taxa.

### Modelo 3: B2B (Empresas)
-   **Treinamento Corporativo**: Venda a plataforma para empresas treinarem funcionários.
-   **White Label**: A empresa coloca a marca dela, mas usa a tecnologia Match&Learn.
-   **Dashboard de RH**: A empresa vê quem são os funcionários mais engajados (baseado no XP/Ranking).

### Modelo 4: Patrocínios (Ads Gamificados)
-   **Missões Patrocinadas**: "Aprenda sobre React com a Vercel". Ao completar, o usuário ganha uma Badge da marca. A marca paga por usuário que completou.

---

## 5. Próximos Passos Sugeridos
1.  **Deploy**: Colocar na Vercel (siga o `DEPLOY.md`).
2.  **Conteúdo Real**: Criar um banco de questões robusto ou conectar na OpenAI.
3.  **Marketing**: Começar a divulgar em comunidades de dev/estudantes.
