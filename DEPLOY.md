# Guia de Deploy - Match&Learn

## Arquitetura de Deploy (Vercel + Supabase)

Para o **Match&Learn**, utilizamos uma arquitetura moderna e robusta:

1.  **Frontend (O Site)**: Hospedado na **Vercel**. Ela roda o Next.js, as páginas e as animações.
2.  **Backend (O Banco de Dados)**: Hospedado no **Supabase**. Ele guarda os usuários, saldos, gigs e perguntas.

> **Nota**: O Supabase não hospeda o site Next.js sozinho. Eles trabalham juntos: A Vercel mostra o site e o site puxa os dados do Supabase.

## Pré-requisitos

1.  **Repositório GitHub**: Certifique-se de que seu código está no GitHub (Já feito!).
2.  **Conta Vercel**: Para colocar o site no ar.
3.  **Conta Supabase**: Para criar o banco de dados.

## Passo 1: Configuração do Supabase (Banco de Dados)

1.  Crie uma conta em [supabase.com](https://supabase.com).
2.  Clique em **"New Project"**.
3.  Defina uma senha forte para o banco (guarde-a!).
4.  Vá em **Project Settings > Database**.
5.  Copie a **Connection String (URI)**. Selecione "Transaction Mode" (porta 6543) para melhor compatibilidade.
    -   Exemplo: `postgres://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
    -   Substitua `[password]` pela senha que você criou.
6.  Essa será sua `DATABASE_URL`.

## Passo 2: Variáveis de Ambiente

Configure as seguintes variáveis no seu projeto na Vercel:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | Conexão do Postgres | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | String aleatória para criptografia | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de produção | `https://seu-app.vercel.app` |
| `WALLET_PRIVATE_KEY` | Chave privada da carteira do servidor | `0x...` |
| `ALCHEMY_RPC_URL` | RPC URL (ex: Sepolia) | `https://eth-sepolia.g.alchemy.com/v2/...` |
| `OPENAI_API_KEY` | (Opcional) Para IA real | `sk-...` |

## Passo 3: Deploy na Vercel

1.  Importe seu repositório na Vercel.
2.  A Vercel detectará o Next.js automaticamente.
3.  Adicione as variáveis de ambiente.
4.  Clique em **Deploy**.

## Passo 4: Pós-Deploy

1.  **Popular Conteúdo**:
    - O banco começará vazio. Você precisará rodar o script de seed ou criar conteúdo via Admin.
    - Se possível, rode `node scripts/seed-db.js` localmente conectado ao banco de produção (alterando temporariamente o `.env`).

## Solução de Problemas

-   **Erro do Prisma**: Se houver erros de banco, certifique-se de que `npx prisma migrate deploy` foi executado.
-   **Timeouts**: Actions do Next.js têm limite de tempo na Vercel (plano Free).
