import type { Request, Response, NextFunction } from "express";
import db from "../../config/db.js";

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const result = await db.query(
      `SELECT id, email, role FROM users WHERE id = $1`,
      [id]
    );
    if ((result.rowCount ?? 0) === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}