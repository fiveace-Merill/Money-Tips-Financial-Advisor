import type { ChatSession } from "@/types/message"

const STORAGE_KEY = "money-tips.chat-sessions.v1"
const ACTIVE_KEY = "money-tips.active-session.v1"
const IMPORT_KEY = "money-tips.guest-import.v1"

/**
 * Local persistence adapter. Replace these two functions with API calls once
 * conversations are stored in the backend database.
 */
export function loadSessions(): ChatSession[] | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ChatSession[]) : null
  } catch {
    return null
  }
}

export function saveSessions(sessions: ChatSession[]): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    // Storage may be unavailable (private mode / quota) — chat still works in memory.
  }
}

export function loadActiveId(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(ACTIVE_KEY)
}

export function saveActiveId(id: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(ACTIVE_KEY, id)
}

export function clearGuestChats(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
  window.localStorage.removeItem(ACTIVE_KEY)
}

export function markGuestChatsImported(): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(IMPORT_KEY, "1")
}

export function hasImportedGuestChats(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(IMPORT_KEY) === "1"
}
