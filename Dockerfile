FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# ==========================================
# Production Stage
# ==========================================
FROM node:22-alpine

WORKDIR /app

# Copy package files and node_modules from builder
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma
COPY --from=builder /app/prisma ./prisma

# Copy built app
COPY --from=builder /app/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Prune dev dependencies (remove bibliotecas de desenvolvimento)
RUN npm prune --omit=dev

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["docker-entrypoint.sh"]