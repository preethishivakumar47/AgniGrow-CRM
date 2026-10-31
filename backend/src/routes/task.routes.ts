import { Router } from "express";
import { getTasks, createTask, toggleTask } from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getTasks);
router.post("/", requireAuth, createTask);
router.patch("/:id/toggle", requireAuth, toggleTask);

export default router;

