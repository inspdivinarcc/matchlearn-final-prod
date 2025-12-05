# Deployment Guide - Match&Learn

This guide covers how to deploy the Match&Learn application to production using Vercel and a PostgreSQL database (e.g., Supabase, Neon, or Vercel Postgres).

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Database**: A PostgreSQL database URL.

## Step 1: Database Setup

1.  Create a new Postgres database (e.g., on Supabase).
2.  Get the `DATABASE_URL` connection string.
3.  Run migrations to create tables:
    ```bash
    npx prisma migrate deploy
    ```

## Step 2: Environment Variables

Configure the following environment variables in your Vercel project settings:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Postgres connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Random string for auth encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Production URL (Vercel automatically handles this, but good to set) | `https://your-app.vercel.app` |
| `WALLET_PRIVATE_KEY` | Private key for the server wallet (for minting) | `0x...` |
| `NFT_CONTRACT_ADDRESS` | Address of your deployed NFT contract | `0x...` |
| `ALCHEMY_RPC_URL` | RPC URL for the blockchain (e.g., Sepolia) | `https://eth-sepolia.g.alchemy.com/v2/...` |
| `OPENAI_API_KEY` | (Optional) For real AI questions | `sk-...` |

## Step 3: Deploy on Vercel

1.  Import your GitHub repository in Vercel.
2.  Vercel will detect the Next.js framework.
3.  Add the Environment Variables from Step 2.
4.  Click **Deploy**.

## Step 4: Post-Deployment

1.  **Seed Content**:
    - Go to your deployed app.
    - Log in.
    - Click the "Seed Content" button (hidden in Home or via Admin) to populate the initial feed.
2.  **Verify Web3**:
    - Check if the "Invisible Wallet" is created for new users.

## Troubleshooting

-   **Prisma Error**: If you see database errors, ensure you ran `npx prisma migrate deploy` locally pointing to the prod DB, or add a "Build Command" in Vercel: `npx prisma generate && next build`.
-   **Timeouts**: Server Actions have a timeout. If AI generation takes too long, Vercel might kill it (limit is usually 10s on free tier).
