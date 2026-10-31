# 💻 AgniGrow CRM — Frontend Application

Next.js web application for **AgniGrow CRM**, featuring an enterprise B2B SaaS theme (Linear/Attio/HubSpot inspired slate palette), interactive Kanban pipeline board, high-density tables, dossier drawers, and analytics dashboards.

## 🛠️ Tech Stack
- **Framework:** Next.js 16.4+ (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4, PostCSS
- **Primitives:** Radix UI / shadcn style primitives, Lucide Icons, Recharts
- **Drag-and-Drop:** @dnd-kit/core & @dnd-kit/sortable
- **Typography:** Google Inter (`sans-serif`)
- **Port:** `3000`

---

## 📁 Directory Structure
```
frontend/
├── app/
│   ├── (crm)/                # Protected CRM Views
│   │   ├── dashboard/        # Executive overview & KPI cards
│   │   ├── leads/            # Leads hub & conversion drawers
│   │   ├── pipeline/         # Drag-and-drop Kanban deal board
│   │   ├── contacts/         # Decision maker directory
│   │   ├── accounts/         # Corporate client portfolio
│   │   ├── quotes/           # Digital quotes & estimates
│   │   ├── reports/          # Agency revenue & conversion analytics
│   │   ├── settings/         # Staff governance & webhook secrets
│   │   └── tasks/            # Follow-up commitments & action queue
│   ├── actions/              # Next.js Server Actions calling Backend REST API
│   ├── login/                # Slate card authentication screen
│   ├── globals.css           # Real CRM Enterprise B2B SaaS Design System
│   └── layout.tsx            # Global Inter typography & shell
├── components/crm/           # High-density CRM UI components
├── lib/
│   ├── api-client.ts         # Unified HTTP client calling Express Backend (Port 5000)
│   ├── auth.ts               # Session cookie management (jose)
│   ├── formatters.ts         # INR currency (₹), Indian phone, and date formatters
│   ├── mock-data.ts          # Instant preview data resilience
│   └── utils.ts              # cn (clsx + tailwind-merge)
├── .env                      # API endpoint config (NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1)
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
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
BACKEND_URL="http://localhost:5000/api/v1"
AUTH_SECRET="e9b2a7c4f1d8e3b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9"
AUTH_COOKIE_NAME="agni_crm_session"
NEXT_PUBLIC_AGNI_WHATSAPP="917200146914"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🎨 Enterprise Design System Highlights
- **Neutral Dark Slate Theme:** Deep charcoal canvas (`#080b11`), elevated cards (`#101622`), subtle 1px borders (`rgba(255,255,255,0.08)`).
- **No Neon Gamer Glow:** Clean, focused B2B SaaS interface built for agency productivity.
- **Resilient Fallback Mode:** Pages render immediately even if the backend is initializing or PostgreSQL is offline.
