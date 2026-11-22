import { NextResponse } from "next/server";
import { EmailInUseError, registerUser } from "@/lib/auth/service";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { fieldErrorsFrom, registerSchema } from "@/lib/auth/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
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
}
