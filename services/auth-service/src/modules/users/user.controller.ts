import type { Request, Response, NextFunction } from "express";
import { updateUserRoleService, getUsersService } from "./user.service.js";
import type { UserRole } from "../../types/roles.js";
import { isValidUUID, isNonEmptyString } from "../../utils/validate.js";

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    if (!isValidUUID(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    if (!isNonEmptyString(body.role)) {
      res.status(400).json({ message: "Role required" });
      return;
    }

    const user = await updateUserRoleService(id, body.role as UserRole);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const role = req.query["role"];
    const roleValue = isNonEmptyString(role) ? (role as UserRole) : undefined;
    const users = await getUsersService(roleValue);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}