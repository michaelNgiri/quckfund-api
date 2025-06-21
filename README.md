
QuickFund API
<p align="center">
<a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" /></a>
<br />
The backend API for the QuickFund micro-lending platform.
</p>


This service provides a scalable, secure, and efficient backend for the QuickFund application. It handles user authentication, loan processing, admin functionalities, and asynchronous notifications.

This API is designed to be deployed as a containerized service and connects to a PostgreSQL database and a Redis instance in production.

🔗 Frontend Repository: https://github.com/michaelngiri/quickfund-ui

Tech Stack

Framework: NestJS

Language: TypeScript

ORM: Prisma

Databases:

PostgreSQL (Production)

SQLite (Local Development)

Queues: BullMQ with Redis

Authentication: JWT (JSON Web Tokens)

Containerization: Docker

Local Development Setup

Follow these steps to run the backend service on your local machine. This setup uses SQLite for the database and Redis via Docker for the queues.

Prerequisites

Node.js (v20 or higher)

npm or yarn

Docker Desktop (must be running)

1. Install Dependencies

Navigate to the quickfund-backend directory and install the required packages:


npm install

2. Start Dependent Services (Redis)

This project requires a Redis instance for its job queue system. The included docker-compose.yml file makes this easy.

In a separate terminal, from the quickfund-backend directory, run:


docker-compose up -d

This will start a Redis container in the background.

3. Configure Local Environment

Create a .env file in the root of the quickfund-backend directory. This file configures the application to use a local SQLite database.


# .env

# --- Application ---
PORT=5007
FRONTEND_URL=http://localhost:3000

# --- Database (SQLite for local development) ---
DATABASE_URL="file:./dev.db"

# --- Queues (Connects to local Docker Redis) ---
REDIS_URL=redis://localhost:6379

# --- Security ---
JWT_SECRET=a-super-secret-key-for-local-development-only

4. Configure Prisma for SQLite

For local development, your prisma/schema.prisma file must be configured to use the sqlite provider.


// prisma/schema.prisma

datasource db {
  provider = "sqlite" // Ensure this is set for local development
  url      = env("DATABASE_URL")
}

5. Create and Seed the Local Database

Run the following commands to create the dev.db SQLite file, apply all migrations, and populate it with test users.


# Create the database and apply the initial migration
npx prisma migrate dev --name init-local

# Seed the database with test accounts
npx prisma db seed


Note: The migrate dev command is for the initial setup. For subsequent schema changes, you can run it again with a new migration name.

6. Run the Application

Finally, start the NestJS development server in watch mode.


npm run start:dev

The backend API will now be running at http://localhost:5007 and connected to your local services.

Production Deployment

The production environment on Render.com uses a different setup:

Database: The provider in prisma/schema.prisma is set to "postgresql".

Migrations: A separate migration history for PostgreSQL exists in the repository for production deployment.

Environment Variables: The DATABASE_URL and REDIS_URL on Render use the Internal Connection Strings provided by the platform for performance and security.

Startup Command: The service uses npm run start:prod, which first runs npx prisma migrate deploy to apply migrations before starting the server.

Test Accounts

The seed script creates the following users, available in both local and production environments after seeding:

Role	Email	Password
Admin	admin@quickfund.com	adminpassword
User	user@quickfund.com	userpassword

The user@quickfund.com account will have one "PENDING" loan application by default.

Available Scripts

npm run start:dev: Runs the app in watch mode for local development.

npm run build: Compiles the TypeScript source code into JavaScript for production.

npm run start:prod: Runs migrations and starts the production server (for deployment).

npm run lint: Lints the codebase for style and error checking.