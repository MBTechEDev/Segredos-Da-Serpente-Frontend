# 1. Base image
FROM node:20.18.0-alpine AS base

# 2. Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Habilita o Corepack para o Yarn Berry (necessário para Next.js 15 + Medusa v2)
RUN corepack enable

# Copia arquivos de configuração de dependências
COPY package.json yarn.lock* .yarnrc.yml* ./
COPY .yarn ./.yarn

# Instala as dependências de forma imutável para garantir estabilidade
RUN yarn install --immutable

# 3. Builder stage
FROM base AS builder
WORKDIR /app

RUN corepack enable

# Copia as dependências instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- VARIÁVEIS DE BUILD (CRÍTICO PARA DOKPLOY) ---
# O Dokploy injetará os valores configurados no painel nestes ARGs
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL

# Mapeia os ARGs para as ENVs que o Next.js consome durante o 'yarn build'
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Executa o build. Aqui o Next.js validará as rotas /br/ usando o Backend URL
RUN yarn build

# 4. Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

# Segurança: Executa a aplicação como um usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia arquivos públicos e o output do build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000

# O server.js é gerado pelo modo standalone do Next.js
CMD ["node", "server.js"]