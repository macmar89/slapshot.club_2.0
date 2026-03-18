# Slapshot Club - Backend

The Express.js backend API and background workers for Slapshot Club.

## Prerequisites

- Node.js (v20+)
- PostgreSQL instance running
- Redis instance running (for BullMQ queues)
- npm

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your values. Ensure you define your PostgreSQL database connection string, Redis connection string, and other required keys.

3. **Database Setup:**
   Apply the current schema to your database:

   ```bash
   # Initialize the database and apply migrations
   npm run db:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will start using `tsx watch` for live-reloading.

## Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Cleans the `dist` folder and compiles the TypeScript code.
- `npm run start` - Runs the compiled production code.
- `npm run db:generate` - Generates migration files based on schema changes.
- `npm run db:migrate` - Applies migrations using Drizzle Kit.
- `npm run db:migrate:dev` - Runs the migration script directly (useful for local dev).
- `npm run db:push` - Pushes database changes using Drizzle (use with CAUTION, prefer migrations).
- `npm run db:studio` - Opens Drizzle Studio to explore your database visually.
