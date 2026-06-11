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

See [backend/README.md](backend/README.md) for detailed API and testing documentation.

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
| `npm test` | backend | Run backend integration tests (uses `.env.test`) |
| `npm run test:frontend` | root | Run frontend tests |
| `npm run build` | frontend | Production build |

## Backend integration tests

Backend tests use a **separate test database** so `cleanDatabase()` never touches your dev data.

### 1. Create the test database

```sql
CREATE DATABASE project_finance_test_db;
```

### 2. Create `.env.test`

```bash
cd backend
cp .env.test.example .env.test
```

Example `.env.test` (MySQL):

```env
PORT=4000
DATABASE_URL="mysql://root:root@localhost:3306/project_finance_test_db"
JWT_SECRET="test_jwt_secret"
JWT_EXPIRES_IN="1d"
```

For PostgreSQL, use a dedicated test URL instead:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_finance_test?schema=public"
```

The URL **must contain `test`** — the backend refuses to run tests otherwise.

### 3. Run tests

```bash
cd backend
npm test
```

This sets `NODE_ENV=test`, syncs the schema to the test DB via `prisma db push`, then runs Jest.

## Project structure

```
backend/     GraphQL API, Prisma, business logic
frontend/    React SPA
```
