import { NextResponse } from "next/server";
import type { Route } from "@/server/http/types";
import type { Message } from "@/types/message";
import { generateMockReply } from "./mockReplies";

/**
 * Temporary chat endpoint. The response shape already matches the intended AI
 * service contract, so only this handler changes when streaming is added.
 */
const postChat: Route = {
  method: "POST",
  path: "chat",
  handler: async ({ request }) => {
    try {
      const body = (await request.json()) as { messages?: Message[] };

      if (!Array.isArray(body.messages) || body.messages.length === 0) {
        return NextResponse.json(
          { error: "A conversation is required." },
          { status: 400 }
        );
      }

      const reply = generateMockReply(body.messages);

      // Simulated latency so loading and typing states are exercised end to end.
      await new Promise((resolve) => setTimeout(resolve, 700));

      return NextResponse.json({
        message: {
          id: crypto.randomUUID(),
          role: "ai",
          content: reply,
          createdAt: new Date().toISOString(),
        } satisfies Message,
      });
    } catch {
      return NextResponse.json(
        { error: "The advisor is temporarily unavailable." },
        { status: 500 }
      );
    }
  },
};

export const chatRoutes: Route[] = [postChat];
