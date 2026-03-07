import type { Request, Response, NextFunction } from "express";
import { signupUser, loginUser } from "./auth.service.js";
import { isNonEmptyString } from "../../utils/validate.js";

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const { email, password, role } = body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    // role is optional — if provided must be a string, service validates allowed values
    const roleValue = isNonEmptyString(role) ? role : undefined;

    const token = await signupUser(email, password, roleValue);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const { email, password } = body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    const token = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
}