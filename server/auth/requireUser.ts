import type { AuthUser } from "@/types/auth";
import { getUserFromToken } from "./service";
import { SESSION_COOKIE } from "./session";

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
};

/** Resolves the signed-in user from the session cookie, or null. */
export async function requireUser(cookies: CookieStore): Promise<AuthUser | null> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getUserFromToken(token);
}
