# Slapshot Club

Full-stack application for predicting hockey matches.

## Overview

**Key Product Features:**

- **Global & Private Leagues:** Users can compete against the entire community or create private groups for friends/colleagues.
- **Freemium Model:** The core experience is free for everyone, while **Premium Tier** unlocks advanced analytics, higher league limits, and exclusive features.
- **High-Performance Architecture:** Built an idempotent background scoring engine using BullMQ and atomic Drizzle transactions for high-availability, consistent data processing.

## Tech Stack

### Backend

- Node.js (TypeScript)
- Express
- Drizzle ORM
- BullMQ (for background jobs)

### Frontend

- Next.js (React 19)
- Tailwind CSS v4
- shadcn/ui
- Zustand (State Management)
- SWR

### Database

- PostgreSQL
- Redis (for Queue/Caching)

### DevOps & Security

- **Authentication**: Custom JWT-based system with secure cookie storage
- Database: Managed via Drizzle Kit (Migrations & Studio)
- Security: Cloudflare Turnstile for bot protection
- Infrastructure: Docker & Docker Compose

## Architecture

The project is divided into two main parts:

- **Backend**: Provide RESTful APIs, manage the PostgreSQL database via Drizzle ORM, and process background sync jobs using BullMQ.
- **Frontend**: A Next.js application handling the user interface and client-side logic, integrated with the backend APIs.

## Quick start

To get the project up and running locally, follow the specific instructions for each environment:

- [Backend Setup & Run Instructions](./backend/readme.md)
- [Frontend Setup & Run Instructions](./frontend/readme.md)

## Roadmap

- [ ] **Expanding test coverage**
- [ ] **In-app notifications**
- [ ] **PWA & push notifications**
- [ ] **Role-Based Access Control (RBAC):** Expanding logic for Premium vs. Free feature toggles.
- [ ] **Stripe Integration**
- [ ] **Google OAuth2 Integration**
