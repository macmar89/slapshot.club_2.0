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
   Create a `.env` file in the root of the `backend` directory. Ensure you define your PostgreSQL database connection string, Redis connection string, and other required keys.

3. **Database Setup:**
   Apply the current schema to your database:
   ```bash
   npm run db:push
   ```
   *(Optional)* Seed development data:
   ```bash
   npm run seed:users
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
- `npm run db:push` - Pushes database changes using Drizzle.
- `npm run db:studio` - Opens Drizzle Studio to explore your database visually.
