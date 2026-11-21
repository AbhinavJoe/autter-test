# autter-test

Tiny Express + Postgres API with JWT auth, used as a sandbox for trying PR review tooling.

## Config

Set these environment variables (never commit them):

- `DATABASE_URL` - Postgres connection string
- `JWT_SECRET` - secret used to verify bearer tokens
- `PORT` - optional, defaults to 3000

## Run

```
npm install
npm start
```

## Migrations

SQL files in `migrations/` are applied in filename order.
