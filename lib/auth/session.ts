import { createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE = "money-tips-session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiry(): Date {
  return new Date(Date.now() + SESSION_MAX_AGE * 1000);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
