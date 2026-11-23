import { NextResponse } from "next/server";
import { readJsonBody } from "@/server/http/json";
import type { Route } from "@/server/http/types";
import type { MeResponse } from "@/types/auth";
import { clientIp, rateLimit } from "./rateLimit";
import {
  authenticateUser,
  destroySession,
  EmailInUseError,
  getUserFromToken,
  registerUser,
} from "./service";
import { SESSION_COOKIE, sessionCookieOptions } from "./session";
import { fieldErrorsFrom, loginSchema, registerSchema } from "./validation";

const register: Route = {
  method: "POST",
  path: "auth/register",
  handler: async ({ request }) => {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const parsed = registerSchema.safeParse(parsedBody.body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          fieldErrors: fieldErrorsFrom(parsed.error),
        },
        { status: 400 }
      );
    }

    try {
      const { user, token } = await registerUser(parsed.data);
      const response = NextResponse.json({ user }, { status: 201 });
      response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
      return response;
    } catch (error) {
      if (error instanceof EmailInUseError) {
        return NextResponse.json(
          {
            error: error.message,
            fieldErrors: { email: "That email is already registered." },
          },
          { status: 409 }
        );
      }

      console.error("Registration failed", error);
      return NextResponse.json(
        { error: "We couldn't create your account. Please try again." },
        { status: 500 }
      );
    }
  },
};

const login: Route = {
  method: "POST",
  path: "auth/login",
  handler: async ({ request }) => {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const parsed = loginSchema.safeParse(parsedBody.body);
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
  },
};

const logout: Route = {
  method: "POST",
  path: "auth/logout",
  handler: async ({ cookies }) => {
    const token = cookies.get(SESSION_COOKIE)?.value;

    if (token) {
      await destroySession(token);
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", {
      ...sessionCookieOptions,
      maxAge: 0,
    });
    return response;
  },
};

const me: Route = {
  method: "GET",
  path: "auth/me",
  handler: async ({ cookies }) => {
    const token = cookies.get(SESSION_COOKIE)?.value;

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
  },
};

export const authRoutes: Route[] = [register, login, logout, me];
