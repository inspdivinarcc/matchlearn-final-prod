# Guia de Deploy - Match&Learn

Este guia cobre como implantar a aplicação Match&Learn em produção usando Vercel e um banco de dados PostgreSQL (ex: Supabase, Neon ou Vercel Postgres).

## Pré-requisitos

1.  **Repositório GitHub**: Certifique-se de que seu código está no GitHub.
2.  **Conta Vercel**: Crie uma conta em [vercel.com](https://vercel.com).
3.  **Banco de Dados**: Uma URL de conexão PostgreSQL.

## Passo 1: Configuração do Banco de Dados

1.  Crie um novo banco Postgres (recomendado: Supabase ou Neon Tech).
2.  Obtenha a string de conexão `DATABASE_URL`.
3.  Rodar migrações (na sua máquina local apontando para prod ou no build da Vercel):
    ```bash
    npx prisma migrate deploy
    ```

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
