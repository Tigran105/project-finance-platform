# Project Finance Management Platform

Full-stack platform for managing project finances: authentication, project teams, invitations, expenses, incomes, and budget reports.

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express, Apollo Server, Prisma, MySQL |
| Frontend | React, TypeScript, Vite, Apollo Client, MUI v7, React Hook Form, Yup |

## Prerequisites

- Node.js 20+
- MySQL database

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Backend runs at `http://localhost:4000`  
GraphQL endpoint: `http://localhost:4000/graphql`

### 2. Frontend

```bash
cd frontend
cp .env.example .env

npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

The Vite dev server proxies `/graphql` to the backend, so the default `VITE_GRAPHQL_URL` works out of the box.

### 3. Run both (from repo root)

```bash
npm install
npm run dev
```

## Features

- **Auth** — Register, login, JWT session
- **Projects** — Create projects, view team members
- **Invitations** — Owners invite by email; users accept or reject
- **Finance** — CRUD for expenses and incomes per project
- **Budget report** — Aggregated totals grouped by normalized name with net difference

## Scripts

| Command | Location | Description |
|---|---|---|
| `npm run dev` | root | Start backend + frontend |
| `npm run dev:backend` | root | Start backend only |
| `npm run dev:frontend` | root | Start frontend only |
| `npm test` | backend | Run backend tests |
| `npm run test:frontend` | root | Run frontend tests |
| `npm run build` | frontend | Production build |

## Project structure

```
backend/     GraphQL API, Prisma, business logic
frontend/    React SPA
```
