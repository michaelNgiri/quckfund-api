
# Use Node.js 20 to match NestJS v11 dependencies
FROM node:20-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy package files first
COPY package*.json ./

# Install all dependencies
RUN npm install --include=dev

# Copy the rest of the application source code
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the TypeScript project
RUN npx nest build

# Explicitly pass the DATABASE_URL environment variable to the seed command
RUN DATABASE_URL=$DATABASE_URL npx prisma db seed
# ----------------------------

# Prune dev dependencies after build and seed
RUN npm prune --omit=dev

EXPOSE 5007
CMD ["npm", "run", "start:prod"]