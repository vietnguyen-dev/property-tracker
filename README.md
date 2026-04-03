# Property Tracker

A REST API for tracking real estate properties — managing purchase prices, loan details, potential sale prices, and rental value calculations.

## Stack

- **Server:** Node.js, Express, TypeScript
- **Database:** MySQL

## Project Structure

```
property-tracker/
├── dbo/                  # SQL schema definitions
│   ├── properties.sql
│   ├── roles.sql
│   ├── users.sql
│   └── views/
└── server/               # Express API
    └── src/
        ├── index.ts      # Entry point
        ├── app.ts        # Express app setup
        ├── routes/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── services/
        └── types/
```

## Getting Started

```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev
```

Server runs on `http://localhost:3000`.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT`   | Port to listen on (default: 3000) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload via tsx |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output |

## Database

Schema is in `dbo/`. Tables: `users`, `roles`, `properties`.
