import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/requireUser";
import { readJsonBody } from "@/server/http/json";
import type { Route } from "@/server/http/types";
import {
  getChatState,
  importGuestChatState,
  saveChatState,
} from "./persistence";
import { chatStateSchema } from "./stateValidation";

function unauthorized() {
  return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
}

function badRequest() {
  return NextResponse.json({ error: "Invalid chat data." }, { status: 400 });
}

const getState: Route = {
  method: "GET",
  path: "chat/state",
  handler: async ({ cookies }) => {
    const user = await requireUser(cookies);
    if (!user) return unauthorized();

    try {
      return NextResponse.json(await getChatState(user.id));
    } catch (error) {
      console.error("Loading chat state failed", error);
      return NextResponse.json(
        { error: "We couldn't load your chats." },
        { status: 500 }
      );
    }
  },
};

const putState: Route = {
  method: "PUT",
  path: "chat/state",
  handler: async ({ request, cookies }) => {
    const user = await requireUser(cookies);
    if (!user) return unauthorized();

    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const parsed = chatStateSchema.safeParse(parsedBody.body);
    if (!parsed.success) return badRequest();

    try {
      return NextResponse.json(await saveChatState(user.id, parsed.data));
    } catch (error) {
      console.error("Saving chat state failed", error);
      return NextResponse.json(
        { error: "We couldn't save your chats." },
        { status: 500 }
      );
    }
  },
};

const importState: Route = {
  method: "POST",
  path: "chat/import",
  handler: async ({ request, cookies }) => {
    const user = await requireUser(cookies);
    if (!user) return unauthorized();

    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const parsed = chatStateSchema.safeParse(parsedBody.body);
    if (!parsed.success) return badRequest();

    try {
      return NextResponse.json(await importGuestChatState(user.id, parsed.data));
    } catch (error) {
      console.error("Importing guest chats failed", error);
      return NextResponse.json(
        { error: "We couldn't import your guest chats." },
        { status: 500 }
      );
    }
  },
};

export const chatStateRoutes: Route[] = [getState, putState, importState];
