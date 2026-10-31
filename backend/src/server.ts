import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import dealRoutes from "./routes/deal.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import accountRoutes from "./routes/account.routes.js";
import taskRoutes from "./routes/task.routes.js";
import quoteRoutes from "./routes/quote.routes.js";
import teamRoutes from "./routes/team.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// CORS Configuration
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000", "https://agnigrow.in", "https://crm.agnigrow.in"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-agni-secret"],
  })
);

app.use(express.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AgniGrow CRM Standalone REST API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount CRM API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/deals", dealRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/quotes", quoteRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server Listener
app.listen(PORT, () => {
  console.log(`\n🔥 AgniGrow CRM Backend Server running at: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Endpoints: http://localhost:${PORT}/api/v1/*\n`);
});

export default app;

