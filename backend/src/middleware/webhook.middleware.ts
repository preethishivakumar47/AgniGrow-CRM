import { Request, Response, NextFunction } from "express";

export function requireWebhookSecret(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["x-agni-secret"] || req.headers.authorization;
  const expectedSecret = process.env.AGNI_WEBHOOK_SECRET || "agni_wh_sec_2026_x87d6f54b2a";

  if (!authHeader || (authHeader !== `Bearer ${expectedSecret}` && authHeader !== expectedSecret)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid or missing webhook secret token",
    });
  }

  next();
}

