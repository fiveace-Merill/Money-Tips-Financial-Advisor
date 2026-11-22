import { Sparkles } from "lucide-react"
import { clsx } from "clsx"
import type { Message } from "@/types/message"
import {
  formatMessageContent,
  formatMessageTime,
} from "@/features/chat/utils/formatMessage"

export function MessageBubble({
  message,
  initials = "OP",
}: {
  message: Message
  initials?: string
}) {
  const isUser = message.role === "user"
  const paragraphs = formatMessageContent(message.content)

  return (
    <div className={clsx("message-in flex items-start gap-3", isUser && "flex-row-reverse")}>
      <div
        className={clsx(
          "grid size-9 shrink-0 place-items-center rounded-full",
          isUser
            ? "bg-secondary-container text-xs font-bold text-on-secondary-container"
            : "landing-solid-primary"
        )}
        aria-hidden="true"
      >
        {isUser ? initials : <Sparkles className="size-4" />}
      </div>

      <div
        className={clsx(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
          isUser ? "landing-solid-primary rounded-tr-md" : "rounded-tl-md bg-background-container text-on-background-container"
        )}
      >
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed lg:text-[15px]">
            {paragraph}
          </p>
        ))}
        <p
          className={clsx(
            "mt-2 text-[10px]",
            isUser ? "text-white/90" : "text-on-background/70"
          )}
        >
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}
