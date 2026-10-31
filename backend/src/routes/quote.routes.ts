import { Router } from "express";
import { getQuotes, createQuote, acceptQuote } from "../controllers/quote.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getQuotes);
router.post("/", requireAuth, createQuote);
router.patch("/:id/accept", requireAuth, acceptQuote);

export default router;

