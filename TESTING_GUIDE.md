# 🧪 AgniGrow CRM — Testing & Verification Playbook

> **Target System:** AgniGrow Back-Office CRM  
> **Architecture:** Decoupled Monorepo (Express REST API Backend + Next.js Frontend)  
> **Document Purpose:** Complete step-by-step instructions to run, test, and verify the Database, Backend, Frontend, and End-to-End user journeys.

---

## 📋 Table of Contents
1. [Quick Reference & Credentials](#1-quick-reference--credentials)
2. [Step 1: Test the Database (PostgreSQL)](#step-1-test-the-database-postgresql)
3. [Step 2: Test the Backend REST API Server (Port 5000)](#step-2-test-the-backend-rest-api-server-port-5000)
4. [Step 3: Test the Frontend Web Application (Port 3000)](#step-3-test-the-frontend-web-application-port-3000)
5. [Step 4: End-to-End Real-World Smoke Test](#step-4-end-to-end-real-world-smoke-test)
6. [Troubleshooting & Quick Fixes](#troubleshooting--quick-fixes)

---

## 1. Quick Reference & Credentials

| Service | Port | Address / URL | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend REST API** | `5000` | `http://localhost:5000` | Core API, Auth, Webhook receiver, CRUD endpoints |
| **Frontend Web App** | `3000` | `http://localhost:3000` | Enterprise CRM UI (Dashboard, Kanban, Grids) |
| **Database Server** | `5432` | `localhost:5432` | PostgreSQL relational database (`agnigrow_crm`) |
| **Prisma Studio (GUI)**| `5555` | `http://localhost:5555` | Visual browser inspector for all database tables |

### Default Staff Login Credentials:
* **Email:** `admin@agnigrow.in`
* **Password:** `AgniAdmin@2026`
* **Role:** `ADMIN` (Agency Administrator)

### Inbound Website Webhook Secret:
* **Header Name:** `x-agni-secret`
* **Secret Key:** `agni_wh_sec_2026_x87d6f54b2a`

---

## Step 1: Test the Database (PostgreSQL)

Before starting the application, verify that your local PostgreSQL instance is running and that the `agnigrow_crm` database is accessible.

### 1. Run the Database Connection Diagnostic:
Open your terminal in the backend directory:
```bash
cd "d:\AGNI GROW CRM\backend"
npx tsx test-connection.ts
```

#### ✅ Expected Output:
```text
=========================================
🔍 AGNI GROW CRM - CONNECTION DIAGNOSTIC
=========================================
📌 Configured DATABASE_URL: postgresql://postgres:****@localhost:5432/agnigrow_crm?schema=public
📌 Configured PORT: 5000

⏳ Testing Database Handshake...
✅ Database Handshake Successful!
📊 Database Details: [
  {
    current_database: 'agnigrow_crm',
    current_user: 'postgres',
    version: 'PostgreSQL 18.6 on x86_64-windows...'
  }
]
👥 Users in DB: 2
📋 Leads in DB: 2
💼 Deals in DB: 1

🎉 Full Database Connection is 100% OPERATIONAL!
```

### 2. View Database Tables Visually via Prisma Studio:
To inspect table rows, foreign keys, and relations directly in your browser:
```bash
cd "d:\AGNI GROW CRM\backend"
npx prisma studio
```
*Open your browser at:* **[http://localhost:5555](http://localhost:5555)**  
*(Press `Ctrl + C` in the terminal when finished).*

---

## Step 2: Test the Backend REST API Server (Port 5000)

### 1. Start the Backend API Server:
```bash
cd "d:\AGNI GROW CRM\backend"
npm run dev
```

You should see:
```text
🔥 AgniGrow CRM Backend Server running at: http://localhost:5000
📡 Health Check: http://localhost:5000/health
🌐 API Endpoints: http://localhost:5000/api/v1/*
```

---

### 2. Test the Health Endpoint:
Open your browser or run in terminal:
* **Browser:** [http://localhost:5000/health](http://localhost:5000/health)
* **cURL:**
  ```bash
  curl -s http://localhost:5000/health
  ```
* **Expected Response:**
  ```json
  {
    "status": "ok",
    "service": "AgniGrow CRM Standalone REST API",
    "version": "1.0.0"
  }
  ```

---

### 3. Test Staff Authentication & JWT Token Issuance:
Open a new PowerShell terminal and run:

```powershell
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"admin@agnigrow.in","password":"AgniAdmin@2026"}'

$token = $login.data.token
Write-Host "✅ Login Successful! Bearer Token:" $token
```

---

### 4. Test Authenticated Pipeline Deals Fetch:
Using the `$token` from above:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/deals" `
  -Method GET `
  -Headers @{ "Authorization" = "Bearer $token" }
```
*Expected Response:* JSON array of active pipeline deals with stages, values, and client relations.

---

### 5. Test Inbound Website Scoper Webhook (from agnigrow.in):
Simulate an automated lead submission from the public website scoper:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads/webhook" `
  -Method POST `
  -Headers @{ 
    "Content-Type"  = "application/json"
    "x-agni-secret" = "agni_wh_sec_2026_x87d6f54b2a" 
  } `
  -Body '{"firstName":"Vignesh","lastName":"Leather","phone":"+919876543210","service":"WEBSITE","budget":"TIER_60K_100K","notes":"Interested in multilingual catalog"}'
```
*Expected Response:*
```json
{
  "success": true,
  "message": "Lead ingested successfully into AgniGrow CRM",
  "leadId": "lead-wh-..."
}
```

---

## Step 3: Test the Frontend Web Application (Port 3000)

### 1. Start the Frontend Application:
In a separate terminal window:
```bash
cd "d:\AGNI GROW CRM\frontend"
npm run dev
```

### 2. Open the CRM Login Page:
Open your browser and navigate to:  
👉 **[http://localhost:3000/login](http://localhost:3000/login)**

### 3. Sign In:
* **Email:** `admin@agnigrow.in`
* **Password:** `AgniAdmin@2026`

---

### 4. Interactive Views Checklist:

| View | URL | What to Test & Verify |
| :--- | :--- | :--- |
| **Executive Overview** | `/dashboard` | • Verify 4 KPI cards render values in Indian Rupee format (`₹`).<br/>• Check recent leads stream and action follow-up queue. |
| **Inbound Leads Hub** | `/leads` | • Click on any lead row to slide open the **HubSpot-style Dossier Drawer**.<br/>• Test changing lead status (New → Qualified).<br/>• Test the direct WhatsApp desk action button. |
| **Deal Pipeline Board** | `/pipeline` | • Grab any deal card and **drag & drop** it across Kanban stages (`Discovery` → `Proposal Sent` → `Negotiation` → `Closed Won`).<br/>• Verify win probability updates automatically. |
| **Contacts Directory** | `/contacts` | • Verify decision maker records with designation, direct phone, and associated company. |
| **Accounts Portfolio** | `/accounts` | • Inspect company records (GSTIN, city, industry, and total contract value). |
| **Quotes & Estimates** | `/quotes` | • Check commercial proposals, itemized billing, and acceptance status. |
| **Reports & Analytics**| `/reports` | • Inspect interactive Recharts graphs (revenue by service category, funnel distribution). |
| **Settings & Team** | `/settings` | • Test clicking **"Copy Ingest Payload"** (copies cURL payload for website developers).<br/>• Test staff status toggle (Active / Suspended). |

---

## Step 4: End-to-End Real-World Smoke Test

Perform this complete end-to-end test to see data flow through all layers:

```
[Inbound Website Webhook] 
       ⬇ 
[Backend REST API: 5000] 
       ⬇ 
[PostgreSQL Database: 5432] 
       ⬇ 
[Frontend Next.js App: 3000]
```

### Scenario Steps:
1. **Send Inbound Lead:** Run the PowerShell webhook snippet from **Step 2.5** above (`firstName: "Vignesh"`).
2. **View in CRM:** In your browser, open **[http://localhost:3000/leads](http://localhost:3000/leads)** and refresh.
   * *Result:* Vignesh appears immediately at the top of the table marked with a blue `● NEW` status indicator.
3. **Inspect Lead:** Click on Vignesh's row to open the Dossier Drawer on the right.
4. **Convert to Deal:** Click the **"Convert Lead"** button at the top of the drawer:
   * Company Name: `Vignesh Leather Exports Ltd`
   * Deal Title: `Multilingual Export Storefront`
   * Deal Value: `₹85,000`
   * Click **Confirm Conversion**.
5. **Verify Deal in Pipeline:** Navigate to **[http://localhost:3000/pipeline](http://localhost:3000/pipeline)**.
   * *Result:* The new deal is now active on the Kanban board under `DISCOVERY` with a `30%` probability badge.
6. **Move Deal to Won:** Drag the deal card to the **`CLOSED WON`** column.
   * *Result:* Probability immediately jumps to `100%`, and the Dashboard Closed Won revenue metric updates!

---

## Troubleshooting & Quick Fixes

### 1. Database Authentication Failure
* **Symptom:** `Authentication failed against database server for user "postgres"`.
* **Fix:** Open [`backend/.env`](file:///d:/AGNI%20GROW%20CRM/backend/.env) and verify that line 8 matches your actual PostgreSQL password (`PostgreSQL`):
  ```env
  DATABASE_URL="postgresql://postgres:PostgreSQL@localhost:5432/agnigrow_crm?schema=public"
  ```
  Then run `npx tsx test-connection.ts` to confirm.

### 2. Port 5000 or 3000 Already in Use
* **Symptom:** `Error: listen EADDRINUSE: address already in use :::5000`.
* **Fix:** In PowerShell, find and terminate the process holding the port:
  ```powershell
  # Find PID on port 5000
  Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess
  # Stop the process
  Stop-Process -Id <PID> -Force
  ```

### 3. Missing Node Modules
* **Fix:** If running on a fresh clone or new machine:
  ```bash
  cd "d:\AGNI GROW CRM\backend" && npm install
  cd "d:\AGNI GROW CRM\frontend" && npm install
  ```

