# 🚀 AgniGrow CRM

**AgniGrow CRM** is a modern, full-stack Customer Relationship Management (CRM) application designed to simplify business operations, manage customer relationships, and streamline sales workflows.

It provides a centralized platform to manage leads, clients, accounts, contacts, deals, quotations, follow-ups, and business reports through an intuitive and responsive dashboard.

---

## ✨ Features

- **Dashboard** – Overview of business activities, sales performance, and key metrics.
- **Lead Management** – Create, manage, track, and organize potential customers.
- **Accounts Management** – Maintain and manage company and client information.
- **Contact Management** – Organize customer details and communication records.
- **Deal Management** – Track business opportunities and deal progress.
- **Sales Pipeline** – Visual Kanban board with drag-and-drop deal management.
- **Quotes Management** – Create and manage customer quotations.
- **Follow-ups** – Track upcoming activities and customer interactions.
- **Reports & Analytics** – Monitor business performance and sales activities.
- **Responsive UI** – Accessible through desktop and mobile browsers.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | Next.js 16 |
| Programming Language | TypeScript |
| UI Framework | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Data Tables | TanStack Table |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| API Architecture | REST API |
| Version Control | Git & GitHub |

---

## 🏗️ Project Architecture

AgniGrow CRM follows a decoupled monorepo architecture with separate frontend and backend applications.

```text
AGNI GROW CRM/
│
├── backend/
│   ├── package.json
│   ├── README.md
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── TESTING_GUIDE.md
├── TECH_STACK.md
├── BUILD.md
└── README.md
```

---

## ⚙️ Prerequisites

Before running the application, install:

- Node.js (LTS)
- npm
- PostgreSQL 15+
- Git

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AgniGrow-CRM.git
```

```bash
cd AgniGrow-CRM
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure the backend environment variables in the `.env` file.

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Configure the frontend environment variables in its `.env` file.

### 4. Database Setup

Make sure PostgreSQL is running and configure the database connection using the appropriate environment variables.

Run the Prisma migrations using the project's configured migration workflow.

### 5. Start the Applications

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

---

## 🌐 Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend REST API | http://localhost:5000 |
| Prisma Studio | http://localhost:5555 |
| PostgreSQL | localhost:5432 |

---

## 🧪 Testing & Verification

Refer to the detailed testing documentation:

**[TESTING_GUIDE.md](./TESTING_GUIDE.md)**

It covers:

- PostgreSQL database connectivity.
- Backend REST API verification.
- Frontend application testing.
- End-to-end real-world smoke testing.
- Troubleshooting and common fixes.

---

## 🔐 Environment Configuration

Keep environment variables and credentials secure.

- Never commit `.env` files.
- Do not expose database credentials.
- Store API keys and secrets securely.
- Use `.env.example` to document required environment variables without including actual secrets.

---

## 🔮 Future Enhancements

- Advanced CRM analytics and reporting.
- Automated customer follow-up workflows.
- WhatsApp integration.
- Email communication integration.
- Role-based access control.
- Enhanced sales forecasting.

---

## 👨‍💻 Development

This project is developed to provide a centralized, scalable, and user-friendly CRM solution for managing business relationships and sales operations.

---

## 📄 License

License information to be added.

---

**AgniGrow CRM – Manage Relationships. Grow Business.** 🌱