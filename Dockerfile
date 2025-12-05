FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN   if [ -f package-lock.json ]; then npm ci --omit=dev;   elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile --prod;   elif [ -f yarn.lock ]; then yarn install --production=true;   else npm i --omit=dev; fi

FROM base AS builder
COPY . .
RUN   if [ -f package-lock.json ]; then npm ci;   elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile;   elif [ -f yarn.lock ]; then yarn install;   else npm i; fi
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
