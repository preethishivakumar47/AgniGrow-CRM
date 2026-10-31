import { Router } from "express";
import { getAccounts, createAccount, deleteAccount } from "../controllers/account.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getAccounts);
router.post("/", requireAuth, createAccount);
router.delete("/:id", requireAuth, requireAdmin, deleteAccount);

export default router;

