# Career Advisor Backend (Express + Prisma + JWT)

A minimal backend to support signup/login and user accounts for your React Vite frontend.

## Quick Start

1) Install deps
```bash
npm install
```

2) Create `.env` (copy from `.env.example`) and set your real password/secret
```env
DATABASE_URL="postgresql://nanthakumara:YOUR_PASSWORD@localhost:5432/career_advisor"
JWT_SECRET="replace-with-a-long-random-string"
PORT=5000
```

3) Generate Prisma client & run migrations
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4) Run the server
```bash
npm run dev
```

The API will run on `http://localhost:5000`.

## Endpoints

- `POST /api/auth/signup` → `{ name, email, password }`  
- `POST /api/auth/login` → `{ email, password }`  
- `GET /api/auth/me` with `Authorization: Bearer <token>`

## Notes
- Uses PostgreSQL. Change `DATABASE_URL` if your DB runs elsewhere.
- Safe to deploy to Render/Fly/Heroku etc. Later you can add other modules (jobs, applications, interviews).
