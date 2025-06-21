# -----------------
# STAGE 1: Builder
# -----------------
# This stage installs all dependencies (including dev) and builds the app.
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install all dependencies needed for the build
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the TypeScript project. This creates the /dist folder.
RUN npm run build


# -----------------
# STAGE 2: Production
# -----------------
# This is the final, lightweight image that will be deployed.
FROM node:18-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy the essential built artifacts from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# The command that will be run when the container starts.
# Render's "Start Command" setting will use this or override it.
CMD ["npm", "run", "start:prod"]