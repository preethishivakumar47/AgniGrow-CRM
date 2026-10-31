# 🏢 AgniGrow CRM — Production Enterprise MVP Build Playbook & Runbook

> **Target System:** AgniGrow Back-Office Enterprise CRM (Decoupled Full-Stack Architecture)  
> **Backend Stack:** Node.js 20+ • Express.js 5 • Prisma ORM v6 • PostgreSQL • JWT Auth • Port `5000`  
> **Frontend Stack:** Next.js 16.4+ (App Router) • React 19 • TypeScript 5 • Tailwind CSS v4 • shadcn/Radix primitives • Inter Font • Port `3000`  
> **Aesthetic Design:** Authentic B2B Enterprise SaaS Theme (Linear / Attio / HubSpot inspired slate-charcoal palette)  
> **Version:** 1.0.0-PROD-MVP  
> **Author:** Lead Full-Stack Architect  

---

## 🏛️ System Architecture Overview

The repository is structured as a clean, decoupled monorepo:

```
D:\AGNI GROW CRM\
├── package.json              # Monorepo root runners (dev:backend, dev:frontend, build:*)
├── BUILD.md                  # Comprehensive architectural build playbook
├── backend/                  # 🚀 Standalone Express.js REST API Server (Port 5000)
│   ├── prisma/schema.prisma  # Production PostgreSQL Database Schema (8 models)
│   ├── prisma/seed.ts        # Seed script with admin credentials & realistic data
│   ├── src/
│   │   ├── controllers/      # 9 Enterprise REST API Controllers (auth, leads, deals, etc.)
│   │   ├── routes/           # Express Routers mounted at /api/v1/*
│   │   ├── middleware/       # JWT Auth, Admin guards, Webhook secret verifier
│   │   └── server.ts         # Express server with CORS & health endpoint
│   ├── .env                  # Backend database & port configuration
│   └── tsconfig.json         # Strict TypeScript compiler options
└── frontend/                 # 💻 Enterprise Next.js CRM Application (Port 3000)
    ├── app/                  # App router pages (dashboard, leads, pipeline, quotes, etc.)
    ├── components/crm/       # Real CRM B2B SaaS UI components (Kanban, tables, sheets)
    ├── lib/                  # Formatters, typed api-client, mock data fallbacks
    └── app/globals.css       # Enterprise Slate/Charcoal Design System
```

---

## 📋 Table of Contents
1. [Prerequisites & System Setup](#1-prerequisites--system-setup)
2. [Workspace Initialization & Dependencies](#2-workspace-initialization--dependencies)
3. [Environment Configuration (`.env`)](#3-environment-configuration-env)
4. [Production-Hardened Prisma Schema](#4-production-hardened-prisma-schema)
5. [Database Migrations & Seed Script](#5-database-migrations--seed-script)
6. [Core Library Utilities](#6-core-library-utilities)
   - [Database Client (`lib/db.ts`)](#database-client-libdbts)
   - [Currency & Date Formatters (`lib/formatters.ts`)](#currency--date-formatters-libformattersts)
   - [Zod Validation Contracts (`lib/schemas/`)](#zod-validation-contracts-libschemas)
   - [Authentication & Role Guard (`lib/auth.ts`)](#authentication--role-guard-libauthts)
7. [API Route Handlers & Server Actions](#7-api-route-handlers--server-actions)
   - [Secure Webhook Ingestion (`api/v1/leads/route.ts`)](#secure-webhook-ingestion-apiv1leadsroutets)
   - [Atomic Lead Conversion Server Action](#atomic-lead-conversion-server-action)
   - [Kanban Deal Stage Transition Action](#kanban-deal-stage-transition-action)
8. [UI Design System & Component Assembly](#8-ui-design-system--component-assembly)
   - [Tailwind CSS v4 Configuration (`globals.css`)](#tailwind-css-v4-configuration-globalscss)
   - [Kanban Board Architecture](#kanban-board-architecture)
9. [Local Verification & Smoke Testing](#9-local-verification--smoke-testing)
10. [Production Deployment Playbook (Vercel + Neon)](#10-production-deployment-playbook-vercel--neon)

---

## 1. Prerequisites & System Setup

Ensure the following runtimes and tools are installed on your workstation:
* **Node.js**: `v20.15.0 LTS` or `v22.x LTS` (`node -v`)
* **npm**: `v10.x` or higher (`npm -v`)
* **PostgreSQL**: Version 15+ running locally or via cloud provider ([Neon.tech](https://neon.tech) / [Supabase](https://supabase.com)).
* **Git**: `v2.40+`

---

## 2. Workspace Initialization & Dependencies

From the repository root directory (`frontend/`):

```bash
# Navigate to frontend directory
cd frontend

# Install core production dependencies
npm install @prisma/client @tanstack/react-table @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react recharts zod clsx tailwind-merge jose bcryptjs

# Install developer dependencies
npm install -D prisma @types/bcryptjs tsx
```

> [!NOTE]
> If npm raises peer dependency warnings regarding React 19 for `@dnd-kit`, install with:
> `npm install --legacy-peer-deps` or add an `overrides` field in `package.json` for React 19.

---

## 3. Environment Configuration (`.env`)

Create `.env` in `frontend/.env`:

```env
# ── DATABASE (PostgreSQL with SSL) ──────────────────────────
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agnigrow_crm?schema=public"
# Neon Cloud Production Example:
# DATABASE_URL="postgresql://user:password@ep-mumbai-pooler.ap-south-1.aws.neon.tech/agnigrow_crm?sslmode=require"

# ── AUTHENTICATION & SECURITY ─────────────────────────────
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET="9f8a3c2b1e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a"
AUTH_COOKIE_NAME="agni_crm_session"

# ── INBOUND WEBHOOK SECURITY ──────────────────────────────
# Secret shared between public agnigrow.in website and CRM API
AGNI_WEBHOOK_SECRET="agni_wh_sec_2026_x87d6f54b2a"

# ── AGENCY CONFIGURATION ──────────────────────────────────
NEXT_PUBLIC_AGNI_WHATSAPP="917200146914"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 4. Production-Hardened Prisma Schema

Create `frontend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────

enum Role {
  ADMIN
  EMPLOYEE
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL_SENT
  CONVERTED
  DISQUALIFIED
}

enum ServiceCategory {
  WEBSITE
  ECOMMERCE
  WHATSAPP_BOT
  BRANDING
  ERP_POS
  EVENT_MICROSITE
  OTHER
}

enum BudgetTier {
  TIER_15K_30K    // ₹15k – ₹30k
  TIER_30K_60K    // ₹30k – ₹60k
  TIER_60K_120K   // ₹60k – ₹1.2L
  TIER_120K_PLUS  // ₹1.2L+
  DISCUSS         // Discuss Scope
}

enum TimelineTier {
  UNDER_2_WEEKS
  WEEKS_2_TO_4
  MONTHS_1_TO_2
  FLEXIBLE
}

enum LeadSource {
  WEBSITE_SCOPER
  WHATSAPP_DIRECT
  PHONE_INQUIRY
  REFERRAL
  MANUAL
}

enum DealStage {
  DISCOVERY
  PROPOSAL_DRAFTED
  PROPOSAL_SENT
  NEGOTIATION
  CLOSED_WON
  CLOSED_LOST
}

enum TaskType {
  CALL
  WHATSAPP_FOLLOW_UP
  SEND_PROPOSAL
  MEETING
  DEADLINE
}

enum Priority {
  URGENT
  HIGH
  MEDIUM
  LOW
}

enum TaskStatus {
  PENDING
  COMPLETED
  CANCELLED
}

enum ActivityType {
  NOTE
  CALL_LOG
  WHATSAPP_SENT
  STAGE_CHANGE
  SYSTEM_EVENT
}

// ─────────────────────────────────────────────────────────────
// MODELS
// ─────────────────────────────────────────────────────────────

model User {
  id           String     @id @default(uuid())
  email        String     @unique
  name         String
  passwordHash String
  role         Role       @default(EMPLOYEE)
  isActive     Boolean    @default(true)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  assignedLeads Lead[]     @relation("LeadAssignee")
  managedDeals  Deal[]     @relation("DealAssignee")
  assignedTasks Task[]     @relation("TaskAssignee")
  activities    Activity[] @relation("ActivityCreator")

  @@index([email])
  @@index([role])
}

model Lead {
  id                     String          @id @default(uuid())
  firstName              String
  lastName               String?
  phone                  String
  email                  String?
  companyName            String?
  service                ServiceCategory @default(WEBSITE)
  budget                 BudgetTier      @default(TIER_30K_60K)
  timeline               TimelineTier    @default(WEEKS_2_TO_4)
  notes                  String?         @db.Text
  status                 LeadStatus      @default(NEW)
  disqualificationReason String?
  source                 LeadSource      @default(WEBSITE_SCOPER)
  rawPayload             Json?

  assignedUserId         String?
  assignedUser           User?           @relation("LeadAssignee", fields: [assignedUserId], references: [id], onDelete: SetNull)

  convertedContactId     String?         @unique
  convertedContact       Contact?        @relation("LeadConversion", fields: [convertedContactId], references: [id], onDelete: SetNull)

  activities             Activity[]
  tasks                  Task[]

  createdAt              DateTime        @default(now())
  updatedAt              DateTime        @updatedAt

  @@index([phone])
  @@index([status])
  @@index([assignedUserId])
  @@index([createdAt])
}

model Account {
  id            String     @id @default(uuid())
  name          String
  industry      String?
  website       String?
  gstin         String?
  city          String?    @default("Vaniyambadi")
  state         String?    @default("Tamil Nadu")
  country       String?    @default("India")
  lifetimeValue Decimal    @default(0.0) @db.Decimal(12, 2)

  contacts      Contact[]
  deals         Deal[]

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([name])
}

model Contact {
  id            String     @id @default(uuid())
  accountId     String
  account       Account    @relation(fields: [accountId], references: [id], onDelete: Cascade)

  firstName     String
  lastName      String?
  phone         String
  email         String?
  designation   String?
  isPrimary     Boolean    @default(false)

  convertedLead Lead?      @relation("LeadConversion")
  deals         Deal[]     @relation("PrimaryContact")
  activities    Activity[]

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([phone])
  @@index([accountId])
}

model Deal {
  id                String          @id @default(uuid())
  title             String
  accountId         String
  account           Account         @relation(fields: [accountId], references: [id], onDelete: Cascade)

  contactId         String
  contact           Contact         @relation("PrimaryContact", fields: [contactId], references: [id], onDelete: Restrict)

  assignedUserId    String
  assignedUser      User            @relation("DealAssignee", fields: [assignedUserId], references: [id], onDelete: Restrict)

  service           ServiceCategory @default(WEBSITE)
  dealValue         Decimal         @default(0.0) @db.Decimal(12, 2)
  stage             DealStage       @default(DISCOVERY)
  probability       Int             @default(20)
  expectedCloseDate DateTime?
  lostReason        String?

  tasks             Task[]
  activities        Activity[]

  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@index([stage])
  @@index([assignedUserId])
  @@index([accountId])
  @@index([createdAt])
}

model Task {
  id             String     @id @default(uuid())
  title          String
  type           TaskType   @default(CALL)
  dueDate        DateTime
  priority       Priority   @default(MEDIUM)
  status         TaskStatus @default(PENDING)

  assignedUserId String
  assignedUser   User       @relation("TaskAssignee", fields: [assignedUserId], references: [id], onDelete: Cascade)

  leadId         String?
  lead           Lead?      @relation(fields: [leadId], references: [id], onDelete: Cascade)

  dealId         String?
  deal           Deal?      @relation(fields: [dealId], references: [id], onDelete: Cascade)

  completedAt    DateTime?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  @@index([assignedUserId])
  @@index([dueDate])
  @@index([status])
}

model Activity {
  id        String       @id @default(uuid())
  type      ActivityType
  content   String       @db.Text
  metadata  Json?

  userId    String
  user      User         @relation("ActivityCreator", fields: [userId], references: [id], onDelete: Restrict)

  leadId    String?
  lead      Lead?        @relation(fields: [leadId], references: [id], onDelete: Cascade)

  dealId    String?
  deal      Deal?        @relation(fields: [dealId], references: [id], onDelete: Cascade)

  contactId String?
  contact   Contact?     @relation(fields: [contactId], references: [id], onDelete: Cascade)

  createdAt DateTime     @default(now())

  @@index([leadId])
  @@index([dealId])
  @@index([userId])
  @@index([createdAt])
}
```

---

## 5. Database Migrations & Seed Script

### 5.1 Run Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init_agnigrow_crm
```

### 5.2 Create Seed Script (`frontend/prisma/seed.ts`)
```typescript
import { PrismaClient, Role, ServiceCategory, BudgetTier, TimelineTier, LeadStatus, DealStage } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AgniGrow CRM database...");

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash("AgniAdmin@2026", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@agnigrow.in" },
    update: {},
    create: {
      email: "admin@agnigrow.in",
      name: "Arish Srinivasan",
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  // 2. Create Sample Sales Rep
  const repPasswordHash = await bcrypt.hash("RepAgni@2026", 10);
  const rep = await prisma.user.upsert({
    where: { email: "sales@agnigrow.in" },
    update: {},
    create: {
      email: "sales@agnigrow.in",
      name: "Karthik Sales Rep",
      passwordHash: repPasswordHash,
      role: Role.EMPLOYEE,
      isActive: true,
    },
  });

  // 3. Seed Sample Inbound Leads
  await prisma.lead.create({
    data: {
      firstName: "Muthu",
      lastName: "Kumar",
      phone: "+919876543210",
      email: "muthu@amburleather.com",
      companyName: "Ambur Fine Leathers",
      service: ServiceCategory.WEBSITE,
      budget: BudgetTier.TIER_60K_120K,
      timeline: TimelineTier.WEEKS_2_TO_4,
      notes: "Requires export catalog with direct WhatsApp quotation button.",
      status: LeadStatus.NEW,
      assignedUserId: admin.id,
    },
  });

  // 4. Seed Sample Account & Deal
  const account = await prisma.account.create({
    data: {
      name: "Vaniyambadi Spices Exporters",
      industry: "Agriculture Exports",
      city: "Vaniyambadi",
      contacts: {
        create: {
          firstName: "Syed",
          lastName: "Ibrahim",
          phone: "+919443211223",
          email: "syed@vnbspices.com",
          designation: "Managing Director",
          isPrimary: true,
        },
      },
    },
    include: { contacts: true },
  });

  await prisma.deal.create({
    data: {
      title: "Export Portal & WhatsApp CRM Bot",
      accountId: account.id,
      contactId: account.contacts[0].id,
      assignedUserId: admin.id,
      service: ServiceCategory.WHATSAPP_BOT,
      dealValue: 95000.0,
      stage: DealStage.PROPOSAL_SENT,
      probability: 60,
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Execute seed:
```bash
npx tsx prisma/seed.ts
```

---

## 6. Core Library Utilities

### Database Client (`frontend/lib/db.ts`)
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Currency & Date Formatters (`frontend/lib/formatters.ts`)
```typescript
/**
 * Formats a number or Prisma Decimal string into Indian Rupee format (e.g. ₹1,25,000)
 */
export function formatINR(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "₹0";
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  if (isNaN(num)) return "₹0";
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Returns formatted WhatsApp Web URL
 */
export function getWhatsAppLink(phone: string, text: string = ""): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
```

### Zod Validation Contracts (`frontend/lib/schemas/lead.schema.ts`)
```typescript
import { z } from "zod";

export const CreateLeadSchema = z.object({
  firstName: z.string().min(2, "Name must be at least 2 characters").max(60),
  lastName: z.string().max(60).optional(),
  phone: z.string().regex(/^[0-9+ ]{10,16}$/, "Must be a valid 10-15 digit phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  companyName: z.string().max(100).optional(),
  service: z.enum([
    "WEBSITE",
    "ECOMMERCE",
    "WHATSAPP_BOT",
    "BRANDING",
    "ERP_POS",
    "EVENT_MICROSITE",
    "OTHER",
  ]).default("WEBSITE"),
  budget: z.enum([
    "TIER_15K_30K",
    "TIER_30K_60K",
    "TIER_60K_120K",
    "TIER_120K_PLUS",
    "DISCUSS",
  ]).default("TIER_30K_60K"),
  timeline: z.enum([
    "UNDER_2_WEEKS",
    "WEEKS_2_TO_4",
    "MONTHS_1_TO_2",
    "FLEXIBLE",
  ]).default("WEEKS_2_TO_4"),
  notes: z.string().max(2000).optional(),
  source: z.enum([
    "WEBSITE_SCOPER",
    "WHATSAPP_DIRECT",
    "PHONE_INQUIRY",
    "REFERRAL",
    "MANUAL",
  ]).default("MANUAL"),
});

export const ConvertLeadSchema = z.object({
  leadId: z.string().uuid(),
  accountName: z.string().min(2).max(100),
  industry: z.string().optional(),
  dealTitle: z.string().min(3).max(120),
  dealValue: z.number().nonnegative(),
  expectedCloseDate: z.string().datetime().optional(),
  assignedUserId: z.string().uuid(),
});
```

### Authentication & Role Guard (`frontend/lib/auth.ts`)
```typescript
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback_super_secret_key_32_bytes_long");
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "agni_crm_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EMPLOYEE";
}

export async function createSessionCookie(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(SECRET, token);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
```

---

## 7. API Route Handlers & Server Actions

### Secure Webhook Ingestion (`frontend/app/api/v1/leads/route.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateLeadSchema } from "@/lib/schemas/lead.schema";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Secret Webhook Token
    const authHeader = req.headers.get("x-agni-secret") || req.headers.get("authorization");
    const expectedSecret = process.env.AGNI_WEBHOOK_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid webhook secret token" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const validatedData = CreateLeadSchema.parse(json);

    // 2. Insert Lead into PostgreSQL
    const lead = await prisma.lead.create({
      data: {
        ...validatedData,
        rawPayload: json,
        source: validatedData.source || "WEBSITE_SCOPER",
      },
    });

    // 3. Create initial Activity Log
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (adminUser) {
      await prisma.activity.create({
        data: {
          type: "SYSTEM_EVENT",
          content: `Inbound lead captured via ${lead.source}: ${lead.firstName} (${lead.phone}) for service ${lead.service}.`,
          leadId: lead.id,
          userId: adminUser.id,
        },
      });
    }

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (error: any) {
    console.error("Lead Ingestion Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process lead" },
      { status: 400 }
    );
  }
}
```

### Atomic Lead Conversion Server Action (`frontend/app/actions/lead-actions.ts`)
```typescript
"use server";

import { prisma } from "@/lib/db";
import { ConvertLeadSchema } from "@/lib/schemas/lead.schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function convertLeadAction(payload: unknown) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = ConvertLeadSchema.parse(payload);

  return await prisma.$transaction(async (tx) => {
    // 1. Fetch Lead
    const lead = await tx.lead.findUniqueOrThrow({ where: { id: data.leadId } });
    if (lead.status === "CONVERTED") {
      throw new Error("This lead is already converted.");
    }

    // 2. Create Account
    const account = await tx.account.create({
      data: {
        name: data.accountName,
        industry: data.industry,
      },
    });

    // 3. Create Contact
    const contact = await tx.contact.create({
      data: {
        accountId: account.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        isPrimary: true,
      },
    });

    // 4. Create Deal
    const deal = await tx.deal.create({
      data: {
        title: data.dealTitle,
        accountId: account.id,
        contactId: contact.id,
        assignedUserId: data.assignedUserId,
        service: lead.service,
        dealValue: data.dealValue,
        stage: "DISCOVERY",
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : null,
      },
    });

    // 5. Update Lead Status
    await tx.lead.update({
      where: { id: lead.id },
      data: {
        status: "CONVERTED",
        convertedContactId: contact.id,
      },
    });

    // 6. Append Immutable Audit Activity
    await tx.activity.create({
      data: {
        type: "SYSTEM_EVENT",
        content: `Lead converted to Account "${account.name}" & Deal "${deal.title}" (Value: ₹${data.dealValue})`,
        userId: session.id,
        leadId: lead.id,
        dealId: deal.id,
        contactId: contact.id,
      },
    });

    revalidatePath("/crm/leads");
    revalidatePath("/crm/pipeline");
    revalidatePath("/crm/dashboard");

    return { success: true, dealId: deal.id };
  });
}
```

### Kanban Deal Stage Transition Action (`frontend/app/actions/deal-actions.ts`)
```typescript
"use server";

import { prisma } from "@/lib/db";
import { DealStage } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateDealStageAction(dealId: string, stage: DealStage, lostReason?: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const deal = await prisma.deal.findUniqueOrThrow({ where: { id: dealId } });

  const updatedDeal = await prisma.deal.update({
    where: { id: dealId },
    data: {
      stage,
      lostReason: stage === "CLOSED_LOST" ? lostReason : null,
    },
  });

  // Log stage transition in activity timeline
  await prisma.activity.create({
    data: {
      type: "STAGE_CHANGE",
      content: `Deal moved from ${deal.stage} to ${stage}${lostReason ? ` (Reason: ${lostReason})` : ""}`,
      userId: session.id,
      dealId: deal.id,
    },
  });

  revalidatePath("/crm/pipeline");
  revalidatePath("/crm/dashboard");

  return { success: true, stage: updatedDeal.stage };
}
```

---

## 8. UI Design System & Component Assembly

### Tailwind CSS v4 Configuration (`frontend/app/globals.css`)
Ensure `frontend/app/globals.css` declares the Ember & Gold palette tokens:

```css
@import "tailwindcss";

:root {
  --background: #0b0807;
  --foreground: #f4eee5;
  --card: #151110;
  --card-hover: #1c1614;
  --border: rgba(244, 238, 229, 0.1);
  --muted: rgba(244, 238, 229, 0.6);
  --ember: #ff5a1f;
  --gold: #ffb020;
}

@theme inline {
  --color-bg: var(--background);
  --color-fg: var(--foreground);
  --color-card: var(--card);
  --color-card-hover: var(--card-hover);
  --color-border: var(--border);
  --color-muted: var(--muted);
  --color-ember: var(--ember);
  --color-gold: var(--gold);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

---

## 9. Local Verification & Smoke Testing

### Step 1: Start Next.js Development Server
```bash
npm run dev
```

### Step 2: Ingest Inbound Lead via cURL / PowerShell
```bash
# Ingest test lead into webhook
curl -X POST http://localhost:3000/api/v1/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer agni_wh_sec_2026_x87d6f54b2a" \
  -d "{\"firstName\":\"Arun\",\"lastName\":\"Palanisamy\",\"phone\":\"+919876543210\",\"companyName\":\"Ambur Leather Hub\",\"service\":\"WEBSITE\",\"budget\":\"TIER_60K_120K\",\"timeline\":\"WEEKS_2_TO_4\",\"notes\":\"Custom export portal required\"}"
```

### Step 3: Verify Database
```bash
npx prisma studio
```
Verify the newly created `Lead` record with status `NEW`.

---

## 10. Production Deployment Playbook (Vercel + Neon)

1. **Database Provisioning (Neon AWS Mumbai `ap-south-1`)**:
   * Create database project in Neon.
   * Enable connection pooling. Copy the pooled connection string.
2. **Vercel Project Setup**:
   * Import repo into Vercel.
   * Add Environment Variables:
     * `DATABASE_URL` (pooled Neon string)
     * `AUTH_SECRET` (32-byte hex)
     * `AGNI_WEBHOOK_SECRET`
     * `NEXT_PUBLIC_AGNI_WHATSAPP` = `917200146914`
3. **Build Command**:
   ```bash
   prisma generate && next build
   ```
4. **Post-Deployment Smoke Test**:
   * Navigate to `https://crm.agnigrow.in/login` or `https://agnigrow.in/crm/login`.
   * Log in with seeded admin credentials.
   * Verify dashboard KPIs, Leads table, and Kanban drag-and-drop.
