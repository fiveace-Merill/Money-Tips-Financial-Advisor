import { NextResponse } from "next/server";
import { AiConfigError } from "@/server/ai/config";
import { OpenRouterError } from "@/server/ai/openrouter";
import { readJsonBody } from "@/server/http/json";
import type { Route } from "@/server/http/types";
import type { Message } from "@/types/message";
import { createAdvisorStream } from "./service";
import { chatRequestSchema } from "./validation";

const encoder = new TextEncoder();

function sse(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function errorResponse(error: unknown) {
  if (error instanceof AiConfigError) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  if (error instanceof OpenRouterError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status === 429 ? 429 : 502 }
    );
  }

  console.error("Chat stream setup failed", error);
  return NextResponse.json(
    { error: "The advisor is temporarily unavailable." },
    { status: 502 }
  );
}

function streamErrorMessage(error: unknown): string {
  if (error instanceof OpenRouterError) return error.message;
  if (error instanceof Error && error.name === "AbortError") {
    return "The response was cancelled.";
  }
  return "The advisor is temporarily unavailable.";
}

/** Streaming chat endpoint. The client renders `delta` events as they arrive. */
const postChat: Route = {
  method: "POST",
  path: "chat",
  handler: async ({ request }) => {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;

    const parsed = chatRequestSchema.safeParse(parsedBody.body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "A valid conversation is required." },
        { status: 400 }
      );
    }

    let stream: AsyncGenerator<string>;
    try {
      stream = await createAdvisorStream(parsed.data, request.signal);
    } catch (error) {
      return errorResponse(error);
    }

    const messageId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        let content = "";

        try {
          for await (const delta of stream) {
            content += delta;
            controller.enqueue(sse("delta", { text: delta }));
          }

          controller.enqueue(
            sse("done", {
              message: {
                id: messageId,
                role: "ai",
                content,
                createdAt,
              } satisfies Message,
            })
          );
        } catch (error) {
          try {
            controller.enqueue(
              sse("error", { error: streamErrorMessage(error) })
            );
          } catch {
            // The client already disconnected; nothing left to report.
          }
        } finally {
          try {
            controller.close();
          } catch {
            // Already closed by the runtime.
          }
        }
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  },
};

export const chatRoutes: Route[] = [postChat];
