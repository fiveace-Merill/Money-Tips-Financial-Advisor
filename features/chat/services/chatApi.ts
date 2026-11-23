import type { ChatSession } from "@/types/message"
import {
  clearGuestChats,
  hasImportedGuestChats,
  loadActiveId,
  loadSessions,
  markGuestChatsImported,
} from "./chatStorage"

export type ChatState = {
  sessions: ChatSession[]
  activeId: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/chat/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error ?? "Unable to load your saved chats.")
  }

  return (await response.json()) as T
}

export function getChatState(): Promise<ChatState> {
  return request<ChatState>("state")
}

export function saveChatState(state: ChatState): Promise<ChatState> {
  return request<ChatState>("state", {
    method: "PUT",
    body: JSON.stringify(state),
  })
}

/** Imports the guest localStorage chat state once, before entering /chat. */
export async function importGuestChats(): Promise<void> {
  if (hasImportedGuestChats()) return

  const sessions = loadSessions() ?? []
  const activeId = loadActiveId() ?? sessions[0]?.id ?? ""

  await request<ChatState>("import", {
    method: "POST",
    body: JSON.stringify({ sessions, activeId }),
  })

  markGuestChatsImported()
  clearGuestChats()
}
