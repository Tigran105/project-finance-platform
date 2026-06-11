# Project Finance Backend

GraphQL API for the Project Finance Management Platform. Handles authentication, project teams, invitations, expenses, incomes, and budget reports.

There are **no REST business endpoints** — the API is GraphQL-only. Use Apollo Sandbox at `/graphql` during development.

## Tech stack

| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Runtime and language |
| Express | HTTP server |
| Apollo Server 4 | GraphQL API |
| Prisma ORM | Database access and migrations |
| MySQL | Database |
| JWT + bcryptjs | Authentication and password hashing |
| Joi | Input validation |
| Jest | Integration tests |
| Helmet + CORS | Basic API hardening |

## Project structure

```
src/
├── config/              Environment loading, Prisma client
├── common/              Auth helpers, errors, constants, shared validation
├── graphql/             Schema, resolvers, context, error formatting
├── modules/
│   ├── auth/            Register, login, JWT utilities
│   ├── projects/        Project CRUD and access control
│   ├── invitations/     Team invitations
│   ├── expenses/        Project expenses
│   ├── incomes/         Project incomes
│   └── budget-report/   Aggregated budget reporting
├── server.ts            Application entry point
└── tests/               Integration tests
prisma/
├── schema.prisma        Database models
└── migrations/          Migration history
scripts/
└── prepare-test-db.mjs  Syncs schema to the test database
```

## Prerequisites

- Node.js 20+
- MySQL 8+

## Environment variables

### Development (`.env`)

Copy the example file:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `4000`) |
| `DATABASE_URL` | Yes | MySQL connection string for **development** |
| `JWT_SECRET` | Yes | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | No | Token lifetime (default: `1d`) |
| `CLIENT_ORIGIN` | No | Allowed frontend origin for CORS (default: `http://localhost:5173`) |
| `NODE_ENV` | No | Runtime environment (default: `development`) |

Example `.env`:

```env
PORT=4000
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/project_finance_db"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1d"
CLIENT_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

### How env loading works

| Mode | File loaded |
|---|---|
| Normal (`NODE_ENV` ≠ `test`) | `.env` |
| Tests (`NODE_ENV=test`) | `.env.test` |

Implementation: `src/config/load-env.ts` is imported before Prisma and env config initialize.

## MySQL setup

### Create databases

```sql
CREATE DATABASE IF NOT EXISTS project_finance_db;
CREATE DATABASE IF NOT EXISTS project_finance_test_db;
```

| Database | Purpose |
|---|---|
| `project_finance_db` | Local development |
| `project_finance_test_db` | Automated integration tests only |

### Docker MySQL (optional)

No `docker-compose.yml` is included in this repository. If you prefer Docker, run MySQL locally and point `DATABASE_URL` at it:

```bash
docker run --name project-finance-mysql -e MYSQL_ROOT_PASSWORD=YOUR_PASSWORD -p 3306:3306 -d mysql:8
```

Then create the databases above inside the container.

## Prisma setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
```

| Command | Description |
|---|---|
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Apply migrations to the **development** database |
| `npm run prisma:studio` | Open Prisma Studio |

## Running the backend

### Development

```bash
npm run dev
```

- API: http://localhost:4000
- GraphQL: http://localhost:4000/graphql
- Health: http://localhost:4000/health

### Production build

```bash
npm run build
npm start
```

Set strong production values for `JWT_SECRET` and `NODE_ENV=production` before starting.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm test` | Run integration tests (uses `.env.test`) |
| `npm run test:prepare` | Sync Prisma schema to the test database |
| `npm run test:migrate` | Alias for `test:prepare` |

## Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | JSON health check |
| `POST /graphql` | GraphQL API |
| `GET /graphql` | Apollo Sandbox (development only) |

GraphQL also exposes:

```graphql
query { health }
query { dbHealth }
```

## Authentication

Protected operations require a JWT:

```
Authorization: Bearer <token>
```

Obtain a token via `register` or `login`. Passwords are hashed with bcryptjs before storage.

## Authorization rules

| Action | Who can perform it |
|---|---|
| Create project | Any authenticated user |
| Update / delete project | Project owner only |
| Invite user | Project owner only |
| View project | Owner or project member |
| Create expense / income | Any project member |
| Update / delete expense / income | Record creator or project owner |
| Accept / reject invitation | Invited user (matching email) |

## Budget report logic

There is **no Budget table**. The budget report is computed dynamically from expenses and incomes:

1. Group expenses by `normalizedName` (lowercased, trimmed name)
2. Group incomes by `normalizedName`
3. Merge groups into report items with `totalIncome`, `totalExpense`, and `difference`
4. Return project totals plus per-name rows

Matching example: `"Materials"`, `" materials "`, and `"MATERIALS"` aggregate under the same normalized name.

## GraphQL API overview

### Queries

| Query | Auth | Description |
|---|---|---|
| `health` | No | API health check |
| `dbHealth` | No | Database connectivity check |
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

### Example: budget report

```graphql
query BudgetReport($projectId: ID!) {
  budgetReport(projectId: $projectId) {
    totalIncome
    totalExpense
    difference
    items {
      name
      totalIncome
      totalExpense
      difference
    }
  }
}
```

## Testing

Integration tests **must not** run against the development database. They use a dedicated test database configured in `.env.test`.

### Why a separate test database?

Tests call `cleanDatabase()` between cases, which deletes all rows from core tables. Running tests against `project_finance_db` would wipe your local development data.

### Test environment setup

**1. Create the test database**

```sql
CREATE DATABASE IF NOT EXISTS project_finance_test_db;
```

**2. Configure `.env.test`**

```bash
cp .env.test.example .env.test
```

Example `.env.test`:

```env
PORT=4000
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/project_finance_test_db"
JWT_SECRET="test_secret_key"
JWT_EXPIRES_IN="1d"
CLIENT_ORIGIN="http://localhost:5173"
NODE_ENV="test"
```

Safety checks when `NODE_ENV=test`:

- Loads `.env.test` automatically (not `.env`)
- Requires `.env.test` to exist
- Requires `DATABASE_URL` to contain `"test"`

**3. Sync schema to the test database**

Automatic (recommended):

```bash
npm test
```

Manual:

```bash
npm run test:prepare
# or
npm run test:migrate
```

Both commands run `prisma db push` against the test database using credentials from `.env.test`.

**4. Run tests**

```bash
npm test
```

### Test suites

| File | Coverage |
|---|---|
| `auth.test.ts` | Registration, login, auth guard |
| `invitation.test.ts` | Invite, accept, reject, duplicates |
| `budget-report.test.ts` | Budget aggregation by normalized name |
| `project.test.ts` | Project update/delete owner checks |
| `money-validation.test.ts` | Amount max validation |

## Security

Implemented in this project:

- JWT authentication on protected GraphQL operations
- bcryptjs password hashing
- Joi validation on inputs (including max money amount `99,999,999.99`)
- Owner/member authorization helpers
- Helmet for secure HTTP headers
- Explicit CORS via `CLIENT_ORIGIN`
- Apollo production hardening (no introspection/landing page in production)
- Production error sanitization (generic message for unexpected errors)
- Production JWT placeholder rejection

Not implemented (possible future improvements):

- Rate limiting
- Refresh tokens
- GraphQL query complexity / depth limits

## Troubleshooting

| Problem | Likely fix |
|---|---|
| `Missing .env.test` | Run `cp .env.test.example .env.test` |
| Tests refuse to run | Ensure test `DATABASE_URL` contains `test` |
| `Authentication failed` (MySQL) | Check username/password in `.env` or `.env.test` |
| Frontend CORS errors | Set `CLIENT_ORIGIN=http://localhost:5173` in backend `.env` |
| Apollo Sandbox blank in dev | Helmet CSP is relaxed in development; restart backend |
| Prisma migration errors | Verify MySQL is running and database exists |
| Raw DB errors on large amounts | Amounts above `99,999,999.99` should now return Joi validation errors |

## Related

See the [root README](../README.md) and [frontend README](../frontend/README.md).
