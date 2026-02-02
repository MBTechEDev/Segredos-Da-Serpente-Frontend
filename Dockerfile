# 1. Base image
FROM node:20.18.0-alpine AS base

# 2. Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Habilita o Corepack para gerenciar o Yarn Berry
RUN corepack enable

# Copia os arquivos de configuração e a pasta .yarn (essencial para Yarn 4)
COPY package.json yarn.lock* .yarnrc.yml* ./
COPY .yarn ./.yarn

# Instala as dependências
RUN yarn install

# 3. Builder stage
FROM base AS builder
WORKDIR /app

# Habilita o Corepack novamente nesta camada
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/.yarnrc.yml ./ .yarnrc.yml/

# Copia o restante do código-fonte
COPY . .

# Variáveis de build corrigidas para o formato KEY=VALUE
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build\\\\\\\\\a

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

# Configuração de cache do Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copia o output do standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000

CMD ["node", "server.js"]