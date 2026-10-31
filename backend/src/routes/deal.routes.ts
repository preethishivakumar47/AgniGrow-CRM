import { Router } from "express";
import { getDeals, createDeal, updateDealStage, deleteDeal } from "../controllers/deal.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getDeals);
router.post("/", requireAuth, createDeal);
router.patch("/:id/stage", requireAuth, updateDealStage);
router.delete("/:id", requireAuth, requireAdmin, deleteDeal);

export default router;

