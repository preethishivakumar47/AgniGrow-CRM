# 🚀 AgniGrow CRM — Backend API Service

Dedicated REST API server and database persistence layer for **AgniGrow CRM**.

## 🛠️ Tech Stack
- **Runtime:** Node.js 20+ LTS
- **Framework:** Express.js 5
- **Language:** TypeScript 5
- **ORM:** Prisma ORM v6
- **Database:** PostgreSQL (Local, Neon.tech, or Supabase)
- **Security:** JWT (JSON Web Tokens), bcryptjs password hashing, HMAC webhook secrets
- **Port:** `5000`

---

## 📁 Directory Structure
```
backend/
├── prisma/
│   ├── schema.prisma         # Production PostgreSQL schema (User, Lead, Account, Contact, Deal, Task, Quote, Activity)
│   └── seed.ts               # Database seed with default admin & realistic Tamil Nadu export data
├── src/
│   ├── config/
│   │   └── db.ts             # Prisma client connection manager
│   ├── controllers/          # 9 REST controllers with full business logic & offline resilience
│   │   ├── auth.controller.ts
│   │   ├── lead.controller.ts
│   │   ├── deal.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── account.controller.ts
│   │   ├── task.controller.ts
│   │   ├── quote.controller.ts
│   │   ├── team.controller.ts
│   │   └── analytics.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT token verification & role guards (Admin/Employee)
│   │   ├── error.middleware.ts   # Global error formatting
│   │   └── webhook.middleware.ts # Shared secret validation (x-agni-secret)
│   ├── routes/               # Express router modules mounted at /api/v1/*
│   └── server.ts             # Server entry point with CORS enabled for port 3000
├── .env                      # Database connection string, JWT secrets, port
├── package.json
└── tsconfig.json
```

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
```env
PORT=5000
CLIENT_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agnigrow_crm?schema=public"
JWT_SECRET="agni_super_secret_jwt_key_2026_x87d6f54b2a_32bytes"
AGNI_WEBHOOK_SECRET="agni_wh_sec_2026_x87d6f54b2a"
```

### 3. Database Migration & Seed
```bash
npx prisma db push
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
Server boots at `http://localhost:5000` with hot-reload enabled via `tsx watch`.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health check & service ping | No |
| `POST` | `/api/v1/auth/login` | Email/password login -> returns JWT token | No |
| `GET` | `/api/v1/auth/me` | Current authenticated user profile | Bearer Token |
| `GET` | `/api/v1/leads` | List all leads | Bearer Token |
| `POST` | `/api/v1/leads` | Create manual lead | Bearer Token |
| `POST` | `/api/v1/leads/webhook` | Ingest lead from agnigrow.in website | `x-agni-secret` Header |
| `POST` | `/api/v1/leads/:id/convert` | Atomic lead conversion into Account, Contact, and Deal | Bearer Token |
| `GET` | `/api/v1/deals` | List all pipeline deals | Bearer Token |
| `PATCH`| `/api/v1/deals/:id/stage`| Transition deal stage & win probability | Bearer Token |
| `GET` | `/api/v1/contacts` | List contacts directory | Bearer Token |
| `GET` | `/api/v1/accounts` | List client accounts | Bearer Token |
| `GET` | `/api/v1/tasks` | List tasks & commitments | Bearer Token |
| `PATCH`| `/api/v1/tasks/:id/status`| Toggle task completion status | Bearer Token |
| `GET` | `/api/v1/quotes` | List fee estimates & commercial quotes | Bearer Token |
| `GET` | `/api/v1/team` | Team member roster | Admin Bearer Token |
| `GET` | `/api/v1/analytics/dashboard` | Executive KPI metrics & funnel statistics | Bearer Token |

