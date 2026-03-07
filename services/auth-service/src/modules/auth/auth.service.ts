import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";
import { env } from "../../config/env.js";
import type { UserRole } from "../../types/roles.js";
import { isValidEmail, isValidLength, isNonEmptyString } from "../../utils/validate.js";

export async function signupUser(
  email: string,
  password: string,
  role?: string
): Promise<string> {
  if (!isValidEmail(email)) throw Object.assign(new Error("Invalid email format"), { statusCode: 400 });
  if (!isValidLength(password, 8, 128)) throw Object.assign(new Error("Password must be 8–128 characters"), { statusCode: 400 });

  const allowedRoles: UserRole[] = ["USER", "CREATOR", "SCORER"];
  const userRole: UserRole =
    role && allowedRoles.includes(role as UserRole)
      ? (role as UserRole)
      : "USER";

  const hash = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role`,
    [email.toLowerCase().trim(), hash, userRole]
  );

  const row = result.rows[0];
  if (!row) throw new Error("Signup failed");

  return jwt.sign(
    { userId: row.id, role: row.role },
    env.JWT_PRIVATE_KEY,
    { algorithm: "RS256", expiresIn: "7d" }
  );
}

export async function loginUser(
  email: string,
  password: string
): Promise<string> {
  if (!isValidEmail(email)) throw Object.assign(new Error("Invalid email format"), { statusCode: 400 });
  if (!isNonEmptyString(password)) throw Object.assign(new Error("Password required"), { statusCode: 400 });

  const result = await db.query(
    `SELECT id, password_hash, role FROM users WHERE email = $1`,
    [email.toLowerCase().trim()]
  );

  if ((result.rowCount ?? 0) === 0) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });

  const user = result.rows[0];
  if (!user) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });

  const ok = await bcrypt.compare(password, user.password_hash as string);
  if (!ok) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });

  return jwt.sign(
    { userId: user.id, role: user.role },
    env.JWT_PRIVATE_KEY,
    { algorithm: "RS256", expiresIn: "7d" }
  );
}