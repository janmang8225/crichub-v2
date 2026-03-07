import dotenv from "dotenv";
dotenv.config();

function require(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

export const env = {
  PORT: parseInt(process.env["PORT"] ?? "3001"),
  DATABASE_URL: require("AUTH_DATABASE_URL"),
  JWT_PRIVATE_KEY: require("JWT_PRIVATE_KEY").replace(/\\n/g, "\n"),
  JWT_PUBLIC_KEY: require("JWT_PUBLIC_KEY").replace(/\\n/g, "\n"),
  INTERNAL_API_KEY: require("INTERNAL_API_KEY"),
};



// The .replace(/\\n/g, "\n") is critical. 
// When you store multi-line PEM keys in .env files, newlines get escaped as \n. 
// This converts them back to real newlines so jsonwebtoken can parse them.

