# Project Finance Frontend

React single-page application for the Project Finance Management Platform. Communicates with the backend exclusively through GraphQL via Apollo Client.

See the [root README](../README.md) for full-stack setup.

## Tech stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Dev server and build tool |
| Apollo Client 3 | GraphQL client |
| MUI v7 | UI components and layout |
| React Hook Form | Form state management |
| Yup | Client-side validation |
| React Router | Routing |
| Vitest + React Testing Library | Unit and component tests |

## Project structure

```
src/
├── apollo/              Apollo Client setup
├── auth/                JWT storage, auth context, route guards
├── components/
│   ├── finance/         Expense/income CRUD, budget report
│   ├── invitations/     Invitation list and invite form
│   ├── layout/          App and auth layouts
│   └── projects/        Create/edit/delete project dialogs
├── config/              Frontend env config
├── constants/           Shared constants (e.g. max money amount)
├── graphql/             Queries, mutations, fragments
├── pages/               Route-level pages
├── test/                Test setup, render helpers, fixtures
├── theme/               MUI theme
├── types/               Shared TypeScript types
├── utils/               Helpers (currency, GraphQL errors)
└── validation/          Yup schemas
```

## Environment variables

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `VITE_GRAPHQL_URL` | No | GraphQL endpoint (default: `http://localhost:4000/graphql`) |

Example `.env`:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

During local development, Vite also proxies `/graphql` to the backend, so the default works out of the box when both apps run locally.

## Installation

```bash
npm install
```

## Running the frontend

### Development

```bash
npm run dev
```

App: http://localhost:5173

Ensure the backend is running at http://localhost:4000.

### Production build

```bash
npm run build
npm run preview   # optional: preview production build
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run lint` | Run ESLint |

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Redirects to `/projects` |
| `/login` | Guest | Login page |
| `/register` | Guest | Registration page |
| `/projects` | Authenticated | Project list, create dialog, my invitations |
| `/projects/:projectId` | Authenticated | Project detail with tabs |

Project create/edit/delete use **dialogs on existing pages**, not separate routes.

### Project detail tabs

| Tab | Description |
|---|---|
| Team | Members list; owner can invite by email |
| Expenses | Expense CRUD |
| Incomes | Income CRUD |
| Budget report | Aggregated totals by normalized name |

Owner-only actions on the detail page: **Edit**, **Delete**, and **Invite team member**.

## Authentication and token behavior

1. User registers or logs in via GraphQL mutations
2. JWT is stored in `localStorage` under key `auth_token`
3. Apollo Client adds `Authorization: Bearer <token>` to every request
4. `AuthProvider` restores session via the `me` query on page load
5. `ProtectedRoute` redirects unauthenticated users to `/login`
6. `GuestRoute` redirects authenticated users away from login/register

Logout clears the token and Apollo cache.

## Apollo Client

Configured in `src/apollo/client.ts`:

- HTTP link to `VITE_GRAPHQL_URL`
- Auth link injects JWT from localStorage
- In-memory cache with `cache-and-network` for watched queries

GraphQL operations are organized under `src/graphql/` using shared fragments for `User`, `Project`, `Invitation`, and finance types.

## Forms and validation

Forms use **React Hook Form** with **Yup** resolvers (`@hookform/resolvers/yup`).

Validation mirrors backend rules where applicable, including:

- Auth: email format, password length
- Projects: name/location length
- Finance: positive amounts, max `99,999,999.99`, max 2 decimal places

Server errors from GraphQL are shown via MUI `Alert` using `getGraphQLErrorMessage`.

## Manual testing flow

1. Start backend and frontend
2. Register at http://localhost:5173/register
3. You should land on `/projects` after login/register
4. Click **New project** and create a project
5. Open the project and invite a user by email (owner only)
6. Log in as the invited user and accept/reject from **My invitations**
7. Add expenses and incomes in their tabs
8. Open **Budget report** and verify grouped totals
9. As owner, use **Edit** or **Delete** on the project detail page

## Tests

```bash
npm test
npm run test:watch
```

Uses Vitest with jsdom, React Testing Library, and shared `renderWithProviders` helpers (MUI theme, Apollo MockedProvider, router, auth context).

Coverage includes validation schemas, auth token helpers, login/register flows, protected routing, and budget report rendering.

## Related

- [Root README](../README.md)
- [Backend README](../backend/README.md)
