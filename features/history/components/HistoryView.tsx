"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Clock3,
  MessageSquareText,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { useChat } from "@/features/chat/context/ChatContext"
import {
  formatSessionDate,
  previewOf,
} from "@/features/chat/utils/formatMessage"

export default function HistoryView() {
  const router = useRouter()
  const {
    sessions,
    activeSession,
    selectSession,
    deleteSession,
    startNewChat,
    isHydrated,
  } = useChat()
  const [query, setQuery] = useState("")
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const conversations = useMemo(() => {
    const term = query.trim().toLowerCase()
    return sessions
      // Greeting-only sessions aren't conversations yet.
      .filter((session) => session.messages.some((message) => message.role === "user"))
      .filter(
        (session) =>
          !term ||
          session.title.toLowerCase().includes(term) ||
          session.messages.some((message) =>
            message.content.toLowerCase().includes(term)
          )
      )
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  }, [sessions, query])

  const totalMessages = conversations.reduce(
    (total, session) => total + session.messages.length,
    0
  )

  const openConversation = (id: string) => {
    selectSession(id)
    router.push("/chat")
  }

  const startChat = () => {
    startNewChat()
    router.push("/chat")
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] landing-accent-text">
            Your conversations
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-on-background sm:text-4xl">
            Chat history
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-on-background/75 sm:text-base">
            Revisit earlier advice, pick up where you left off, or clear
            conversations you no longer need.
          </p>
        </div>

        {isHydrated && conversations.length > 0 && (
          <dl className="flex gap-3">
            <div className="min-w-[7.5rem] rounded-2xl border border-background-container bg-surface p-4">
              <dt className="text-xs text-on-background/70">Conversations</dt>
              <dd className="mt-1 text-2xl font-bold text-on-background">
                {conversations.length}
              </dd>
            </div>
            <div className="min-w-[7.5rem] rounded-2xl border border-background-container bg-surface p-4">
              <dt className="text-xs text-on-background/70">Messages</dt>
              <dd className="mt-1 text-2xl font-bold text-on-background">
                {totalMessages}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div className="mt-9">
        <label htmlFor="history-search" className="sr-only">
          Search conversations
        </label>
        <div className="relative max-w-xl">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-on-background/60"
            aria-hidden="true"
          />
          <input
            id="history-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-2xl border border-background-container bg-surface py-3.5 pl-11 pr-11 text-sm text-on-background shadow-sm outline-none transition-colors placeholder:text-on-background/60 focus:border-primary"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-on-background/70 hover:bg-background-container/60"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {!isHydrated ? (
          <div className="grid gap-4 md:grid-cols-2" aria-hidden="true">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl border border-background-container bg-surface/70"
              />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-background-container bg-surface/60 px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-container/50 landing-accent-text">
              <MessageSquareText className="size-6" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-on-background">
              {query ? "No matching conversations" : "No conversations yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-on-background/75">
              {query
                ? "Try a different word or clear your search to see everything."
                : "Conversations you start with your advisor will be saved here automatically."}
            </p>
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-6 rounded-full border border-background-container px-5 py-2.5 text-sm font-medium text-on-background transition-colors hover:bg-background-container/60"
              >
                Clear search
              </button>
            ) : (
              <button
                type="button"
                onClick={startChat}
                className="landing-solid-primary mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-md hover:-translate-y-0.5"
              >
                Start your first chat <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {conversations.map((session) => {
              const isActive = session.id === activeSession?.id
              const lastMessage = [...session.messages]
                .reverse()
                .find((message) => message.role === "user" || message.role === "ai")
              const preview = lastMessage
                ? previewOf(
                    `${lastMessage.role === "user" ? "You: " : "Advisor: "}${lastMessage.content}`
                  )
                : ""

              return (
                <li key={session.id}>
                  <article className="flex h-full flex-col rounded-2xl border border-background-container bg-surface p-5 shadow-sm transition-colors hover:border-primary/40">
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-container/50 landing-accent-text">
                        <MessageSquareText className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate font-semibold text-on-background">
                            {session.title}
                          </h2>
                          {isActive && (
                            <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[11px] font-semibold text-on-secondary-container">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-on-background/75">
                          {preview}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-background/70">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="size-3.5" aria-hidden="true" />
                            {formatSessionDate(session.updatedAt)}
                          </span>
                          <span>{session.messages.length} messages</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-background-container pt-4">
                      {confirmId === session.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="rounded-xl px-3.5 py-2 text-sm font-medium text-on-background/80 hover:bg-background-container/60"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteSession(session.id)
                              setConfirmId(null)
                            }}
                            className="rounded-xl bg-destructive/10 px-3.5 py-2 text-sm font-semibold text-destructive hover:bg-destructive/20"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-label={`Delete conversation: ${session.title}`}
                            onClick={() => setConfirmId(session.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-on-background/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => openConversation(session.id)}
                            className="landing-solid-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:-translate-y-0.5"
                          >
                            Open <ArrowRight className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
