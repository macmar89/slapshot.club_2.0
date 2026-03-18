# Slapshot Club - Frontend

The Next.js frontend application for Slapshot Club.

## Prerequisites

- Node.js (v20+)
- npm

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the `frontend` directory to define necessary variables (e.g., your Backend API URL, Cloudflare Turnstile required keys).

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will start on [http://localhost:3800](http://localhost:3800).

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

## Available Scripts

- `npm run dev` - Starts the development server on port 3800.
- `npm run build` - Builds the application for production deployment.
- `npm run start` - Starts the production Node.js server.
- `npm run lint` - Runs ESLint checks.
- `npm run format` - Formats the codebase using Prettier.
