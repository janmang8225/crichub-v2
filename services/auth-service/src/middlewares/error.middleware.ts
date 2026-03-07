import type { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isKnownError = typeof err.statusCode === "number";

  let status: number;
  let message: string;

  if (isKnownError) {
    status = err.statusCode;
    message = err.message;
  } else if (err.code && typeof err.code === "string") {
    // PostgreSQL error codes
    switch (err.code) {
      case "23505":
        status = 409;
        message = "Already exists";
        break;
      case "23503":
        status = 400;
        message = "Referenced record not found";
        break;
      case "22P02":
        status = 400;
        message = "Invalid ID format";
        break;
      default:
        status = 500;
        message = "Database error";
    }
  } else {
    status = 500;
    message = "Internal server error";
  }

  console.error(`[ERROR] ${status} — ${err.message}`);
  res.status(status).json({ message });
}