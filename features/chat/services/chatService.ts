import type { Message } from "@/types/message"

/**
 * Client-side gateway to the chat backend.
 * Swap the endpoint/implementation here when the real service is ready.
 */
export async function requestAdvisorReply(messages: Message[]): Promise<Message> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error("The advisor couldn't respond. Please try again.")
  }

  const data = (await response.json()) as { message: Message }
  return data.message
}
