import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export function internalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key = req.headers["x-internal-api-key"];
  if (key !== env.INTERNAL_API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}