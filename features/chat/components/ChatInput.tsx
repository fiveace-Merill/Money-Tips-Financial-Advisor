"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { SendHorizontal } from "lucide-react"
import Loader from "@/components/Loader"
import { useChat } from "@/features/chat/context/ChatContext"

export default function ChatInput() {
  const [value, setValue] = useState("")
  const { sendMessage, isLoading } = useChat()

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    const text = value.trim()
    if (!text || isLoading) return
    void sendMessage(text)
    setValue("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-3xl items-end gap-3"
    >
      <label htmlFor="chat-message" className="sr-only">
        Ask a financial question
      </label>
      <textarea
        id="chat-message"
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a financial question"
        disabled={isLoading}
        className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-background-container bg-surface px-4 py-3.5 text-sm text-on-background shadow-sm outline-none transition-colors placeholder:text-on-background/60 focus:border-primary disabled:opacity-60 lg:text-[15px]"
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={!value.trim() || isLoading}
        className="landing-solid-primary grid size-12 shrink-0 place-items-center rounded-2xl shadow-md shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? <Loader /> : <SendHorizontal className="size-5" />}
      </button>
    </form>
  )
}
