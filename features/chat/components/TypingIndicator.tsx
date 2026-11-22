import { Sparkles } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="message-in flex items-start gap-3">
      <div className="landing-solid-primary grid size-9 shrink-0 place-items-center rounded-full" aria-hidden="true">
        <Sparkles className="size-4" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-background-container px-4 py-[18px]">
        <span className="typing-dot size-1.5 rounded-full bg-on-background/60" />
        <span className="typing-dot size-1.5 rounded-full bg-on-background/60" />
        <span className="typing-dot size-1.5 rounded-full bg-on-background/60" />
      </div>
      <span className="sr-only" role="status">
        Your advisor is typing
      </span>
    </div>
  )
}
