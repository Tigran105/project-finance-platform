# Project Finance Management Platform

A full-stack technical assignment for managing project finances: user authentication, project teams, email invitations, expense/income tracking, and dynamic budget reports.

The API is **GraphQL-first**. There are no REST business endpoints, so **Swagger/OpenAPI is not included**. In development, use **Apollo Sandbox** at `http://localhost:4000/graphql` to explore and test the schema.

## Tech stack

| Layer | Technologies |
|---|---|
| Backend | Node.js, TypeScript, Express, Apollo GraphQL Server, Prisma ORM, MySQL, JWT, bcryptjs, Joi, Jest |
| Frontend | React, TypeScript, Vite, Apollo Client, MUI v7, React Hook Form, Yup, Vitest |

## Main features

- User registration and login with JWT authentication
- Project CRUD with owner/member authorization
- Email invitations with accept/reject workflow
- Expense and income CRUD per project
- Dynamic budget report (no separate Budget table)
- Expenses/incomes grouped by lowercased trimmed `normalizedName`
- Backend integration tests (auth, invitations, budget report, projects, validation)
- Frontend unit/component tests (Vitest + React Testing Library)

## URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:4000 |
| GraphQL | http://localhost:4000/graphql |
| Health check | http://localhost:4000/health |

## Project structure

```
project-finance-platform/
├── backend/          GraphQL API, Prisma, business logic, Jest tests
├── frontend/         React SPA, Apollo Client, Vitest tests
├── package.json      Root scripts to run both apps together
└── README.md
```

Detailed setup:

- [backend/README.md](backend/README.md) — API, database, testing, security
- [frontend/README.md](frontend/README.md) — UI, routes, Apollo Client, frontend tests

## Prerequisites

- Node.js 20+
- MySQL 8+

## Quick start (full stack)

### 1. Databases

```sql
CREATE DATABASE IF NOT EXISTS project_finance_db;
CREATE DATABASE IF NOT EXISTS project_finance_test_db;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, and other values

npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env

npm install
npm run dev
```

### 4. Run both from repo root

```bash
npm install
npm run dev
```

## Root scripts

| Command | Description |
|---|---|
| `npm run dev` | Start backend + frontend |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build:backend` | Compile backend |
| `npm run build:frontend` | Build frontend |
| `npm run test:backend` | Run backend integration tests |
| `npm run test:frontend` | Run frontend tests |

## Testing overview

Backend tests **must not** run against the development database. They use a separate test database via `.env.test`. See [backend/README.md — Testing](backend/README.md#testing) for full instructions.

```bash
cd backend
cp .env.test.example .env.test
npm test
```

## Manual testing flow

1. Register a user at `/register`
2. Log in at `/login`
3. Create a project from `/projects`
4. As project owner, invite another user by email
5. Log in as the invited user and accept/reject the invitation
6. Open a project and add expenses and incomes
7. Open the **Budget report** tab and verify grouped totals
8. As owner, edit or delete the project from the project detail page

## GraphQL in development

Open http://localhost:4000/graphql in the browser to use Apollo Sandbox. Example:

```graphql
query {
  health
  dbHealth
}
```

Protected operations require:

```
Authorization: Bearer <token>
```
