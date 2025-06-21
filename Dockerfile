FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Copy package files first to leverage Docker's layer caching
COPY package*.json ./

# Install ALL dependencies (dev dependencies are needed for 'prisma generate' and 'nest build')
RUN npm install

# Copy the rest of the application source code
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the TypeScript project. This creates the /dist folder.
RUN npm run build

# Expose the port the app runs on (Render will use this automatically)
EXPOSE 5007

# The command that will be run when the container starts.
# Render's "Start Command" setting ('npm run start:prod') will run this.
CMD ["npm", "run", "start:prod"]