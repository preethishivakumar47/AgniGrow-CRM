import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAnalytics);
router.get("/dashboard", getAnalytics);
router.get("/reports", getAnalytics);

export default router;
