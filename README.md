# Task Management System

A clean, production‑ready task manager built with **Next.js 14**, **Node.js/Express**, **TypeScript**, and **Prisma** using **SQLite** for local development.

## Features
- Auth with JWT access + refresh tokens
- Task CRUD with search, filters, and export
- Responsive UI, dark mode, animations
- Notifications & profile dashboard

## Tech Stack
**Frontend:** Next.js 14, TypeScript, Tailwind, shadcn/ui, React Query, Zustand, Framer Motion  
**Backend:** Node.js, Express, TypeScript, Prisma  
**Database:** SQLite (local), Prisma ORM

## Local Setup (SQLite)
1) Install dependencies in backend and frontend
2) Backend .env (create manually):
    - DATABASE_URL=file:./prisma/dev.db
    - JWT_ACCESS_SECRET=... (32+ chars)
    - JWT_REFRESH_SECRET=... (32+ chars)
    - FRONTEND_URL=http://localhost:3000
3) Generate Prisma client + push schema
4) Run backend (port 5000) and frontend (port 3000)

## Environment Variables
**backend/.env**
- DATABASE_URL=file:./prisma/dev.db
- JWT_ACCESS_SECRET=your_secret
- JWT_REFRESH_SECRET=your_secret
- JWT_ACCESS_EXPIRY=15m
- JWT_REFRESH_EXPIRY=7d
- FRONTEND_URL=http://localhost:3000

**frontend/.env.local**
- NEXT_PUBLIC_API_URL=http://localhost:5000/api

## API (Quick Overview)
Auth: /api/auth/register, /api/auth/login, /api/auth/refresh, /api/auth/logout, /api/auth/me  
Tasks: /api/tasks (GET/POST), /api/tasks/:id (GET/PATCH/DELETE), /api/tasks/:id/toggle

## Project Structure
backend/  (Express + Prisma)  
frontend/ (Next.js App Router)

## Notes
- SQLite database file lives at backend/prisma/dev.db
- For production, use a managed DB (PostgreSQL) and update DATABASE_URL
- [ ] Performance monitoring

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment (development/production)
DATABASE_URL=...            # PostgreSQL connection string
JWT_ACCESS_SECRET=...       # JWT access token secret (32+ chars)
JWT_REFRESH_SECRET=...      # JWT refresh token secret (32+ chars)
JWT_ACCESS_EXPIRY=15m       # Access token expiry
JWT_REFRESH_EXPIRY=7d       # Refresh token expiry
FRONTEND_URL=...            # Frontend URL for CORS
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=...     # Backend API URL
```

## 📄 License

MIT License - feel free to use this project for learning or production!

## 👨‍💻 Support

For issues or questions:
1. Check troubleshooting section above
2. Review error logs in terminal
3. Check browser console (F12)
4. Verify environment variables

---

**Built with ❤️ using modern web technologies**

Tech Stack: Next.js 14 | Node.js | TypeScript | Prisma | PostgreSQL | Tailwind CSS | shadcn/ui | Framer Motion | Zustand | React Query
