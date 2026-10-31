import { Router } from "express";
import { getTeam, createTeamMember, toggleUserStatus } from "../controllers/team.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getTeam);
router.post("/", requireAuth, requireAdmin, createTeamMember);
router.patch("/:id/toggle", requireAuth, requireAdmin, toggleUserStatus);

export default router;

