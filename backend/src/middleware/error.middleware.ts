import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Unhandled Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
}

