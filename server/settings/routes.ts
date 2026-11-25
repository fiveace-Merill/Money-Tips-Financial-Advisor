import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/requireUser";
import { readJsonBody } from "@/server/http/json";
import type { Route } from "@/server/http/types";
import {
  getPreferences,
  importGuestPreferences,
  savePreferences,
} from "./service";
import { preferencesSchema } from "./validation";

function unauthorized() {
  return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
}

function badRequest() {
  return NextResponse.json({ error: "Invalid preference data." }, { status: 400 });
}

const getPreferencesRoute: Route = {
  method: "GET",
  path: "settings/preferences",
  handler: async ({ cookies }) => {
    const user = await requireUser(cookies);
    if (!user) return unauthorized();

    try {
      return NextResponse.json(await getPreferences(user.id));
    } catch (error) {
      console.error("Loading preferences failed", error);
      return NextResponse.json(
        { error: "We couldn't load your preferences." },
        { status: 500 }
      );
    }
  },
};

const putPreferencesRoute: Route = {
  method: "PUT",
  path: "settings/preferences",
  handler: async ({ request, cookies }) => {
    const user = await requireUser(cookies);
    if (!user) return unauthorized();

    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const parsed = preferencesSchema.safeParse(parsedBody.body);
    if (!parsed.success) return badRequest();

    try {
      return NextResponse.json(await savePreferences(user.id, parsed.data));
    } catch (error) {
      console.error("Saving preferences failed", error);
      return NextResponse.json(
        { error: "We couldn't save your preferences." },
        { status: 500 }
      );
    }
  },
};

const importPreferencesRoute: Route = {
  method: "POST",
  path: "settings/import",
  handler: async ({ request, cookies }) => {
    const user = await requireUser(cookies);
    if (!user) return unauthorized();

    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const parsed = preferencesSchema.safeParse(parsedBody.body);
    if (!parsed.success) return badRequest();

    try {
      return NextResponse.json(
        await importGuestPreferences(user.id, parsed.data)
      );
    } catch (error) {
      console.error("Importing preferences failed", error);
      return NextResponse.json(
        { error: "We couldn't import your preferences." },
        { status: 500 }
      );
    }
  },
};

export const settingsRoutes: Route[] = [
  getPreferencesRoute,
  putPreferencesRoute,
  importPreferencesRoute,
];
