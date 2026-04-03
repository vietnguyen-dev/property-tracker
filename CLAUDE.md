# Claude Code Guide

## Project

Property tracking REST API built with Node.js + Express + TypeScript. MySQL is the database.

## Commands

```bash
cd server
npm run dev      # start dev server (tsx watch)
npm run build    # compile to dist/
npm start        # run compiled output
```

## Architecture

- `src/index.ts` — starts the HTTP server
- `src/app.ts` — Express app, middleware, and route mounting
- `src/routes/` — route definitions
- `src/controllers/` — request handlers
- `src/middleware/` — Express middleware
- `src/models/` — data shapes / DB query logic
- `src/services/` — business logic
- `src/types/` — shared TypeScript types

## Database

MySQL. Schema lives in `dbo/`. Key tables:

- `users` — app users
- `properties` — linked to `users.id`, stores address, pricing, and loan info
- `roles` — role definitions

## Conventions

- All routes mounted under `/api`
- Use `async/await` throughout — no callbacks
- Keep controllers thin; put logic in services
