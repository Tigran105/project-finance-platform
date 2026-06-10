# Frontend

React client for the Project Finance Management Platform.

See the [root README](../README.md) for full setup instructions.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Environment

Copy `.env.example` to `.env`:

```
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

During local development, Vite also proxies `/graphql` to the backend.
