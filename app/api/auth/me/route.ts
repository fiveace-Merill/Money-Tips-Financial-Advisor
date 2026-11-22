import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/service";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import type { MeResponse } from "@/types/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json<MeResponse>({ user: null });
  }

  const user = await getUserFromToken(token);
  if (!user) {
    const response = NextResponse.json<MeResponse>({ user: null });
    response.cookies.set(SESSION_COOKIE, "", {
      ...sessionCookieOptions,
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.json<MeResponse>({ user });
}
