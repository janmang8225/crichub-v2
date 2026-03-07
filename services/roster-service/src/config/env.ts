import dotenv from "dotenv";
dotenv.config();

function require(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

export const env = {
  PORT: parseInt(process.env["PORT"] ?? "3002"),
  DATABASE_URL: require("ROSTER_DATABASE_URL"),
  INTERNAL_API_KEY: require("INTERNAL_API_KEY"),
};