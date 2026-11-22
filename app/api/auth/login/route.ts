import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/auth/rateLimit";
import { authenticateUser } from "@/lib/auth/service";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { fieldErrorsFrom, loginSchema } from "@/lib/auth/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: fieldErrorsFrom(parsed.error),
      },
      { status: 400 }
    );
  }

  const limit = rateLimit(
    `login:${clientIp(request)}:${parsed.data.email}`,
    10,
    15 * 60 * 1000
  );
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  try {
    const result = await authenticateUser(parsed.data);
    if (!result) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { error: "We couldn't sign you in. Please try again." },
      { status: 500 }
    );
  }
}
