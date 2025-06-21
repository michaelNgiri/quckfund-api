<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->




# QuickFund Backend Service

This directory contains the backend API for the QuickFund application, built with NestJS.

## Tech Stack
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** SQLite (for local development)

---

## Setup and Installation

### 1. Install Dependencies

1. Navigate to this directory and run:

npm install

2. Configure Environment Variables

Create a .env file in this directory (quickfund-backend/.env). Copy the following configuration:

Generated dotenv
# Application Port
PORT=5007

# URL of the frontend for CORS
FRONTEND_URL=http://localhost:3001

# Database Connection (SQLite)
DATABASE_URL="file:./dev.db"

# JWT Secret Key (replace with a long, random string in production)
JWT_SECRET=a-very-long-and-random-secret-for-development

3. Run Database Migrations and Seeding

This step will create your local SQLite database file and populate it with test users.


# Apply database schema changes
npx prisma migrate dev

# Populate the database with initial data
npx prisma db seed

4. Run the Development Server

npm run start:dev

The backend API will now be running on http://localhost:5007.

Test Accounts

The database seed script creates the following users for easy testing:

Role	Email	Password
Admin	admin@quickfund.com	adminpassword
Regular User	user@quickfund.com	userpassword

The regular user also has one "PENDING" loan application created by default.

Available Scripts

npm run start:dev: Runs the app in watch mode.

npm run build: Builds the application for production.

npm run lint: Lints the codebase.