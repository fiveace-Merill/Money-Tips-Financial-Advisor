"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ChatSession, Message } from "@/types/message"
import { useAuth } from "@/features/auth/context/AuthContext"
import { titleFromMessage } from "@/features/chat/utils/formatMessage"
import { getChatState, saveChatState } from "@/features/chat/services/chatApi"
import { streamAdvisorReply } from "@/features/chat/services/chatService"
import {
  clearGuestChats,
  loadActiveId,
  loadSessions,
  saveActiveId,
  saveSessions,
} from "@/features/chat/services/chatStorage"

const GREETING = "Hello I am your AI financial Advisor, How Can I help?"
const SEED_TIME = "2026-01-01T09:00:00.000Z"

/** Deterministic first render keeps server and client markup identical. */
const SEED_SESSION: ChatSession = {
  id: "welcome",
  title: "New Chat",
  createdAt: SEED_TIME,
  updatedAt: SEED_TIME,
  messages: [
    {
      id: "welcome-message",
      role: "ai",
      content: GREETING,
      createdAt: SEED_TIME,
    },
  ],
}

function createSession(): ChatSession {
  const now = new Date().toISOString()
  const id = crypto.randomUUID()

  return {
    id,
    title: "New Chat",
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `${id}-greeting`,
        role: "ai",
        content: GREETING,
        createdAt: now,
      },
    ],
  }
}

interface ChatContextValue {
  sessions: ChatSession[]
  activeSession: ChatSession | null
  isLoading: boolean
  isStreaming: boolean
  isHydrated: boolean
  error: string | null
  startNewChat: () => void
  selectSession: (id: string) => void
  deleteSession: (id: string) => void
  clearAllSessions: () => void
  sendMessage: (content: string) => Promise<void>
  clearError: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [sessions, setSessions] = useState<ChatSession[]>([SEED_SESSION])
  const [activeId, setActiveId] = useState("welcome")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)
  const remoteLoaded = Boolean(userId && loadedUserId === userId)
  const streamControllerRef = useRef<AbortController | null>(null)
  const skipSyncRef = useRef(false)
  const previousUserIdRef = useRef<string | null>(null)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    // Hydrate after the deterministic first paint so localStorage never
    // changes the server-rendered markup.
    void Promise.resolve().then(() => {
      if (cancelled) return

      const stored = loadSessions()
      if (stored?.length) {
        setSessions(stored)
        const savedActiveId = loadActiveId()
        setActiveId(
          savedActiveId && stored.some((session) => session.id === savedActiveId)
            ? savedActiveId
            : stored[0].id
        )
      }
      setHydrated(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Guest data stays in localStorage. Signed-in data lives only in the database.
  useEffect(() => {
    if (!hydrated || user || previousUserIdRef.current || isStreaming) return
    saveSessions(sessions)
  }, [sessions, hydrated, isStreaming, user])

  useEffect(() => {
    if (!hydrated || user || previousUserIdRef.current) return
    if (activeId) saveActiveId(activeId)
  }, [activeId, hydrated, user])

  // Never leave one account's chats in guest storage after logout.
  useEffect(() => {
    const currentUserId = user?.id ?? null
    const previousUserId = previousUserIdRef.current
    previousUserIdRef.current = currentUserId

    if (previousUserId && !currentUserId) {
      clearGuestChats()
      setSessions([SEED_SESSION])
      setActiveId("welcome")
      setLoadedUserId(null)
    }
  }, [user])

  // Load database-backed chats after auth has finished importing guest data.
  useEffect(() => {
    if (!hydrated || !userId) return

    let active = true

    void getChatState()
      .then((state) => {
        if (!active) return

        const nextSessions = state.sessions.length ? state.sessions : [SEED_SESSION]
        const firstId = nextSessions[0]?.id ?? "welcome"
        const nextActiveId = nextSessions.some(
          (session) => session.id === state.activeId
        )
          ? state.activeId
          : firstId

        skipSyncRef.current = true
        setSessions(nextSessions)
        setActiveId(nextActiveId)
        setLoadedUserId(userId)
      })
      .catch(() => {
        if (!active) return
        setError("We couldn't load your saved chats. Refresh to try again.")
      })

    return () => {
      active = false
    }
  }, [hydrated, userId])

  // Debounced database sync for signed-in users; skip partial streamed text.
  useEffect(() => {
    if (!hydrated || !userId || !remoteLoaded || isStreaming) return

    if (skipSyncRef.current) {
      skipSyncRef.current = false
      return
    }

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      void saveChatState({ sessions, activeId }).catch(() => {
        setError("We couldn't save your chats. Please try again.")
      })
    }, 400)

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [sessions, activeId, hydrated, userId, remoteLoaded, isStreaming])

  useEffect(() => {
    return () => {
      streamControllerRef.current?.abort()
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [])

  const activeSession =
    sessions.find((session) => session.id === activeId) ?? sessions[0] ?? null

  const startNewChat = useCallback(() => {
    const session = createSession()
    setSessions((previous) => [session, ...previous])
    setActiveId(session.id)
    setError(null)
  }, [])

  const selectSession = useCallback((id: string) => {
    setActiveId(id)
    setError(null)
  }, [])

  const deleteSession = useCallback((id: string) => {
    setSessions((previous) => {
      const remaining = previous.filter((session) => session.id !== id)
      return remaining.length ? remaining : [createSession()]
    })
    setActiveId((current) => (current === id ? "" : current))
  }, [])

  const clearAllSessions = useCallback(() => {
    const session = createSession()
    setSessions([session])
    setActiveId(session.id)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim()
      if (!text || !activeSession || isLoading) return

      setError(null)
      streamControllerRef.current?.abort()
      const controller = new AbortController()
      streamControllerRef.current = controller

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      }
      const placeholderId = crypto.randomUUID()
      const placeholder: Message = {
        id: placeholderId,
        role: "ai",
        content: "",
        createdAt: new Date().toISOString(),
      }
      const conversation = [...activeSession.messages, userMessage]
      const sessionId = activeSession.id
      const isFirstQuestion = !activeSession.messages.some(
        (message) => message.role === "user"
      )
      const title = isFirstQuestion ? titleFromMessage(text) : activeSession.title

      setSessions((previous) =>
        previous.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                title,
                messages: [...conversation, placeholder],
                updatedAt: new Date().toISOString(),
              }
            : session
        )
      )
      setIsLoading(true)
      setIsStreaming(true)

      try {
        const reply = await streamAdvisorReply(conversation, {
          signal: controller.signal,
          onDelta: (delta) => {
            setSessions((previous) =>
              previous.map((session) =>
                session.id === sessionId
                  ? {
                      ...session,
                      messages: session.messages.map((message) =>
                        message.id === placeholderId
                          ? { ...message, content: message.content + delta }
                          : message
                      ),
                      updatedAt: new Date().toISOString(),
                    }
                  : session
              )
            )
          },
        })

        setSessions((previous) =>
          previous.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map((message) =>
                    message.id === placeholderId ? reply : message
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : session
          )
        )
      } catch (cause) {
        setSessions((previous) =>
          previous.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.filter(
                    (message) => message.id !== placeholderId
                  ),
                }
              : session
          )
        )

        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Something went wrong. Please try again."
          )
        }
      } finally {
        // A superseded request must not reset the state of the active stream.
        if (streamControllerRef.current === controller) {
          streamControllerRef.current = null
          setIsStreaming(false)
          setIsLoading(false)
        }
      }
    },
    [activeSession, isLoading]
  )

  const value = useMemo<ChatContextValue>(
    () => ({
      sessions,
      activeSession,
      isLoading,
      isStreaming,
      isHydrated: hydrated,
      error,
      startNewChat,
      selectSession,
      deleteSession,
      clearAllSessions,
      sendMessage,
      clearError,
    }),
    [
      sessions,
      activeSession,
      isLoading,
      isStreaming,
      hydrated,
      error,
      startNewChat,
      selectSession,
      deleteSession,
      clearAllSessions,
      sendMessage,
      clearError,
    ]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used inside a ChatProvider")
  }
  return context
}
