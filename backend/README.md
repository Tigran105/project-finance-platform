# Project Finance Backend

GraphQL API for the Project Finance Management Platform. Handles authentication, project teams, invitations, expenses, incomes, and budget reports.

## Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server |
| Apollo Server 4 | GraphQL API |
| Prisma | ORM and migrations |
| MySQL | Database |
| JWT | Authentication |
| Joi | Input validation |
| Jest | Integration tests |

## Prerequisites

- Node.js 20+
- MySQL 8+

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/project_finance_db"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1d"
```

Create the development database:

```sql
CREATE DATABASE project_finance_db;
```

### 3. Set up the database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start the server

```bash
npm run dev
```

- API: `http://localhost:4000`
- GraphQL: `http://localhost:4000/graphql`
- Health check: `http://localhost:4000/health`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production server |
| `npm test` | Run integration tests on the test database |
| `npm run test:prepare` | Sync Prisma schema to the test database |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Apply migrations (development) |
| `npm run prisma:studio` | Open Prisma Studio |

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `4000`) |
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | No | Token lifetime (default: `1d`) |

When `NODE_ENV=test`, the app loads `.env.test` instead of `.env`. See [Testing](#testing) below.

## Project structure

```
src/
├── config/           Environment loading, Prisma client
├── common/           Shared auth helpers, errors, utilities
├── graphql/          Schema, resolvers, request context
├── modules/
│   ├── auth/         Register, login, JWT utilities
│   ├── projects/     Project CRUD and access control
│   ├── invitations/  Team invitations
│   ├── expenses/     Project expenses
│   ├── incomes/      Project incomes
│   └── budget-report/ Aggregated budget reporting
├── server.ts         Application entry point
└── tests/            Integration tests
prisma/
├── schema.prisma     Database models
└── migrations/       Migration history
```

## Authentication

Protected operations require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via the `register` or `login` mutations. The GraphQL context resolves the current user from the token on each request.

## Access control

| Action | Who can perform it |
|---|---|
| Create project | Any authenticated user |
| Update / delete project | Project owner only |
| Invite user | Project owner only |
| View project | Owner or project member |
| Create expense / income | Any project member |
| Update / delete expense / income | Record creator or project owner |
| Accept / reject invitation | Invited user (matching email) |

## GraphQL API

### Queries

| Query | Auth | Description |
|---|---|---|
| `health` | No | API health check |
| `me` | Optional | Current authenticated user |
| `projects` | Yes | Projects the user belongs to |
| `project(id)` | Yes | Single project details |
| `myInvitations` | Yes | Invitations for the current user's email |
| `expenses(projectId)` | Yes | Expenses for a project |
| `incomes(projectId)` | Yes | Incomes for a project |
| `budgetReport(projectId)` | Yes | Aggregated budget report |

### Mutations

| Mutation | Auth | Description |
|---|---|---|
| `register` | No | Create account, returns JWT |
| `login` | No | Sign in, returns JWT |
| `createProject` | Yes | Create a new project |
| `updateProject` | Yes | Update project (owner only) |
| `deleteProject` | Yes | Delete project (owner only) |
| `inviteUser` | Yes | Send email invitation (owner only) |
| `acceptInvitation` | Yes | Accept a pending invitation |
| `rejectInvitation` | Yes | Reject a pending invitation |
| `createExpense` / `updateExpense` / `deleteExpense` | Yes | Expense CRUD |
| `createIncome` / `updateIncome` / `deleteIncome` | Yes | Income CRUD |

### Example: login

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      name
      email
    }
  }
}
```

Variables:

```json
{
  "input": {
    "email": "user@example.com",
    "password": "123456"
  }
}
```

## Testing

Integration tests use a **separate test database** so `cleanDatabase()` never wipes development data.

### 1. Create the test database

```sql
CREATE DATABASE project_finance_test_db;
```

### 2. Configure test environment

```bash
cp .env.test.example .env.test
```

Example `.env.test`:

```env
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/project_finance_test_db"
JWT_SECRET="test_jwt_secret"
JWT_EXPIRES_IN="1d"
```

The `DATABASE_URL` **must contain `test`** — tests abort otherwise as a safety guard.

### 3. Run tests

```bash
npm test
```

This sets `NODE_ENV=test`, runs `prisma db push` against the test database, then executes Jest.

## Production build

```bash
npm run build
npm start
```

Ensure production environment variables are set before starting the compiled server.

## Related

See the [root README](../README.md) for full-stack setup including the React frontend.
