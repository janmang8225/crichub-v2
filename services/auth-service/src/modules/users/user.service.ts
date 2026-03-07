import db from "../../config/db.js";
import type { UserRole } from "../../types/roles.js";

const VALID_ROLES: UserRole[] = ["ADMIN", "CREATOR", "SCORER", "USER", "PLAYER"];

export async function updateUserRoleService(
  userId: string,
  role: UserRole
): Promise<{ id: string; email: string; role: UserRole }> {
  if (!VALID_ROLES.includes(role)) {
    throw Object.assign(new Error("Invalid role"), { statusCode: 400 });
  }

  const result = await db.query(
    `UPDATE users SET role = $1 WHERE id = $2
     RETURNING id, email, role`,
    [role, userId]
  );

  if ((result.rowCount ?? 0) === 0) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const row = result.rows[0];
  if (!row) throw new Error("Update failed");
  return row as { id: string; email: string; role: UserRole };
}

export async function getUsersService(
  role?: UserRole
): Promise<Array<{ id: string; email: string; role: UserRole }>> {
  if (role) {
    if (!VALID_ROLES.includes(role)) {
      throw Object.assign(new Error("Invalid role filter"), { statusCode: 400 });
    }
    const result = await db.query(
      `SELECT id, email, role FROM users WHERE role = $1 ORDER BY email`,
      [role]
    );
    return result.rows as Array<{ id: string; email: string; role: UserRole }>;
  }

  const result = await db.query(
    `SELECT id, email, role FROM users ORDER BY email`
  );
  return result.rows as Array<{ id: string; email: string; role: UserRole }>;
}