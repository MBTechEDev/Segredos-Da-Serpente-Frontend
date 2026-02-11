# 1. Base image
FROM node:20.18.0-alpine AS base

# 2. Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Habilita o Corepack para o Yarn Berry
RUN corepack enable

# Copia arquivos de configuração de dependências
COPY package.json yarn.lock* .yarnrc.yml* ./
COPY .yarn ./.yarn

# Instala as dependências
RUN yarn install

# 3. Builder stage
FROM base AS builder
WORKDIR /app

RUN corepack enable

# Copia as dependências instaladas e o cache do yarn
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn

# Copia o restante do código-fonte primeiro
# Isso evita o conflito de tentar substituir diretórios por arquivos
COPY . .

# Variáveis de build
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL

ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN yarn build

# 4. Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Standalone mode do Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000

CMD ["node", "server.js"]