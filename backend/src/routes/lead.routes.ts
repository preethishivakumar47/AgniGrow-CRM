import { Router } from "express";
import { 
  getLeads, 
  getLeadById, 
  createLead, 
  ingestWebhookLead, 
  updateLead, 
  deleteLead, 
  convertLead 
} from "../controllers/lead.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { requireWebhookSecret } from "../middleware/webhook.middleware.js";

const router = Router();

// Public webhook from agnigrow.in
router.post("/webhook", requireWebhookSecret, ingestWebhookLead);

// Authenticated Lead Desk Endpoints
router.get("/", requireAuth, getLeads);
router.post("/", requireAuth, createLead);
router.get("/:id", requireAuth, getLeadById);
router.patch("/:id", requireAuth, updateLead);
router.delete("/:id", requireAuth, requireAdmin, deleteLead);
router.post("/:id/convert", requireAuth, convertLead);

export default router;

