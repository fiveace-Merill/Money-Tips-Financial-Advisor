import { NextResponse } from "next/server"
import { generateMockReply } from "@/features/chat/services/mockReplies"
import type { Message } from "@/types/message"

/**
 * Temporary chat endpoint.
 *
 * The frontend already talks to this route as it would to a real backend.
 * When the backend is implemented, replace the body of this handler with a
 * call to the AI service — the client contract (messages in, message out)
 * stays the same.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: Message[] }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "A conversation is required." },
        { status: 400 }
      )
    }

    const reply = generateMockReply(body.messages)

    // Simulated latency so loading and typing states are exercised end to end.
    await new Promise((resolve) => setTimeout(resolve, 700))

    return NextResponse.json({
      message: {
        id: crypto.randomUUID(),
        role: "ai",
        content: reply,
        createdAt: new Date().toISOString(),
      } satisfies Message,
    })
  } catch {
    return NextResponse.json(
      { error: "The advisor is temporarily unavailable." },
      { status: 500 }
    )
  }
}
