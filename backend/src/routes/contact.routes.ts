import { Router } from "express";
import { getContacts, createContact, deleteContact } from "../controllers/contact.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getContacts);
router.post("/", requireAuth, createContact);
router.delete("/:id", requireAuth, requireAdmin, deleteContact);

export default router;

