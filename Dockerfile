# Use Node.js 20 to match NestJS v11 dependencies
FROM node:20-alpine

# 1. Declare DATABASE_URL as a build-time argument
ARG DATABASE_URL

# 2. Make this argument available as an environment variable INSIDE the container
ENV DATABASE_URL=$DATABASE_URL
# -----------------------------

WORKDIR /usr/src/app

# Set NODE_ENV for subsequent commands
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

# Run the database seed command. It will now see the correct DATABASE_URL.
RUN npx prisma db seed

# Prune dev dependencies after build and seed
RUN npm prune --omit=dev

EXPOSE 5007
CMD ["npm", "run", "start:prod"]