"use client"

import { useEffect, useRef } from "react"
import { Lightbulb, X } from "lucide-react"
import { useChat } from "@/features/chat/context/ChatContext"
import { useSettings } from "@/features/settings/context/SettingsContext"
import { MessageBubble } from "@/features/chat/components/MessageBubble"
import { TypingIndicator } from "@/features/chat/components/TypingIndicator"

const suggestions = [
  "How can I build a monthly budget?",
  "Help me save more each month",
  "Where should I start investing?",
]

export default function ChatWindow() {
  const { activeSession, isLoading, isStreaming, error, clearError, sendMessage } = useChat()
  const { initials } = useSettings()
  const bottomRef = useRef<HTMLDivElement>(null)
  const messages = activeSession?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, isLoading, activeSession?.id])

  return (
    <div className="chat-scroll h-full overflow-y-auto px-3 py-5 sm:px-5">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-on-background"
          >
            <span className="flex-1">{error}</span>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={clearError}
              className="rounded-md p-1 hover:bg-destructive/10"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div aria-live="polite" aria-relevant="additions" className="flex flex-col gap-5">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              initials={initials}
            />
          ))}
          {isLoading && !isStreaming && <TypingIndicator />}
        </div>

        {messages.length === 1 && !isLoading && (
          <div className="ml-12 rounded-2xl border border-background-container bg-surface/70 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-on-background/60">
              <Lightbulb className="size-4 text-primary" />
              Try asking
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  className="rounded-full border border-background-container bg-surface px-4 py-2 text-left text-xs text-on-background/80 transition-colors hover:border-primary/50 hover:bg-primary-container/30"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
