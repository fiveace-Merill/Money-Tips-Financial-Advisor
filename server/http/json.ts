import { NextResponse } from "next/server";

type JsonResult =
  | { ok: true; body: unknown }
  | { ok: false; response: Response };

export async function readJsonBody(request: Request): Promise<JsonResult> {
  try {
    return { ok: true, body: await request.json() };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid request." }, { status: 400 }),
    };
  }
}
