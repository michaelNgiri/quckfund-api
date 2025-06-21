# ---- Base Node ----
    FROM node:18-alpine AS base
    WORKDIR /usr/src/app
    
    # ---- Dependencies ----
    FROM base AS dependencies
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # ---- Build ----
    FROM base AS builder
    COPY . .
    RUN npm install
    RUN npx prisma generate
    RUN npm run build
    
    # ---- Production ----
    FROM base AS production
    ENV NODE_ENV=production
    COPY --from=dependencies /usr/src/app/node_modules ./node_modules
    COPY --from=builder /usr/src/app/dist ./dist
    COPY --from=builder /usr/src/app/prisma ./prisma
    COPY --from=builder /usr/src/app/package.json ./package.json
    
    # The prisma migrate command needs to be run in the deployed environment
    # CMD ["npx", "prisma", "migrate", "deploy", "&&", "node", "dist/main"]
    # For simplicity in this challenge, we'll just run the app. The migration is assumed to be run manually or by a separate process.
    CMD ["node", "dist/main"]