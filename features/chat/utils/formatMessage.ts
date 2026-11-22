/** Formats an ISO timestamp for display beside a chat message. */
export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Splits message content into paragraphs while ignoring blank lines. */
export function formatMessageContent(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

/** Builds a short conversation title from the first user message. */
export function titleFromMessage(content: string): string {
  const trimmed = content.trim()
  if (trimmed.length <= 42) return trimmed
  return `${trimmed.slice(0, 42).trimEnd()}…`
}

/** Shortens message text for use as a conversation preview. */
export function previewOf(content: string, maxLength = 110): string {
  const trimmed = content.replace(/\s+/g, " ").trim()
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength).trimEnd()}…`
}

/**
 * Human-friendly date for a conversation. Only called in the browser after
 * hydration so locale/timezone differences cannot cause a markup mismatch.
 */
export function formatSessionDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isSameDay) return `Today, ${formatMessageTime(iso)}`

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) return `Yesterday, ${formatMessageTime(iso)}`

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
  })
}
