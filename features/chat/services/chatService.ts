import type { Message } from "@/types/message"

type AdvisorStreamOptions = {
  onDelta: (text: string) => void
  signal?: AbortSignal
}

type SseEvent = {
  event: string
  data: Record<string, unknown>
}

function parseEvent(raw: string): SseEvent | null {
  let event = "message"
  const dataLines: string[] = []

  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("event:")) event = line.slice(6).trim()
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart())
  }

  if (dataLines.length === 0) return null

  try {
    return {
      event,
      data: JSON.parse(dataLines.join("\n")) as Record<string, unknown>,
    }
  } catch {
    return null
  }
}

/**
 * Client gateway to the streaming chat endpoint. Each `delta` updates the
 * in-progress assistant message; `done` returns the final persisted shape.
 */
export async function streamAdvisorReply(
  messages: Message[],
  { onDelta, signal }: AdvisorStreamOptions
): Promise<Message> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  })

  if (!response.ok) {
    let message = "The advisor couldn't respond. Please try again."
    try {
      const data = (await response.json()) as { error?: string }
      if (data.error) message = data.error
    } catch {
      // Keep the friendly fallback when the error body is not JSON.
    }
    throw new Error(message)
  }

  if (!response.body) {
    throw new Error("The advisor couldn't respond. Please try again.")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let finalMessage: Message | null = null
  let streamError: string | null = null

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split("\n\n")
      buffer = events.pop() ?? ""

      for (const rawEvent of events) {
        const parsed = parseEvent(rawEvent)
        if (!parsed) continue

        if (parsed.event === "delta" && typeof parsed.data.text === "string") {
          onDelta(parsed.data.text)
        } else if (parsed.event === "done" && parsed.data.message) {
          finalMessage = parsed.data.message as Message
        } else if (parsed.event === "error") {
          streamError =
            typeof parsed.data.error === "string"
              ? parsed.data.error
              : "The advisor couldn't respond. Please try again."
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  if (streamError) throw new Error(streamError)
  if (!finalMessage) {
    throw new Error("The advisor couldn't respond. Please try again.")
  }

  return finalMessage
}
