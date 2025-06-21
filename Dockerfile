# Use Node.js 20 to match NestJS v11 dependencies
FROM node:20-alpine

# Set the working directory
# Invalidate cache: 1
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's layer caching
COPY package*.json ./

# Explicitly tell npm to install ALL dependencies, including dev, for the build
RUN npm install --include=dev

# Copy the rest of the application source code
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the TypeScript project. This creates the /dist folder.
RUN npx nest build

RUN npx prisma db seed

# --- DEBUGGING ---
# List the contents of the current directory to verify that 'dist' exists.
RUN ls -la

# After building, prune the dev dependencies to keep the final image smaller
RUN npm prune --omit=dev

# Expose the port the app runs on
EXPOSE 5007

# The command that will be run when the container starts.
CMD ["npm", "run", "start:prod"]