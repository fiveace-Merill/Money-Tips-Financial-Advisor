import { MoreHorizontal, SendHorizontal, Sparkles, TrendingUp } from "lucide-react"

/**
 * Purely decorative preview of the chat experience shown on the landing page.
 * Marked aria-hidden so assistive technology skips the mock conversation.
 */
export default function ChatPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[520px] pb-8">
      <div className="absolute -inset-6 rounded-[3rem] bg-primary/10 blur-3xl" />

      <div className="float-slow relative overflow-hidden rounded-[28px] border border-background-container bg-surface shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-3 border-b border-background-container/70 px-5 py-4">
          <div className="relative grid size-10 place-items-center rounded-full bg-primary text-on-primary">
            <Sparkles className="size-5" />
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-background">Money Tips AI</p>
            <p className="text-xs text-on-background/70">Always here to help</p>
          </div>
          <MoreHorizontal className="ml-auto size-5 text-on-background/55" />
        </div>

        <div className="space-y-4 px-5 py-6">
          <p className="w-fit max-w-[88%] rounded-2xl rounded-tl-md bg-background-container px-4 py-3 text-sm leading-relaxed text-on-background-container">
            Hi! I&apos;m your AI financial advisor. What would you like to work on today?
          </p>
          <p className="landing-solid-primary ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed">
            How can I save more each month?
          </p>
          <p className="w-fit max-w-[88%] rounded-2xl rounded-tl-md bg-background-container px-4 py-3 text-sm leading-relaxed text-on-background-container">
            Let&apos;s look at your spending and build a plan around your goals.
          </p>
          <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-md bg-background-container px-4 py-3.5">
            <span className="typing-dot size-1.5 rounded-full bg-on-background/50" />
            <span className="typing-dot size-1.5 rounded-full bg-on-background/50" />
            <span className="typing-dot size-1.5 rounded-full bg-on-background/50" />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-background-container/70 px-4 py-4">
          <div className="flex-1 rounded-full bg-background-container/60 px-4 py-2.5 text-sm text-on-background/70">
            Ask a financial question
          </div>
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
            <SendHorizontal className="size-4" />
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -top-5 hidden items-center gap-2 rounded-full border border-background-container bg-surface px-4 py-2 text-xs font-semibold text-on-background shadow-lg sm:flex">
        <Sparkles className="size-3.5 text-primary" />
        Personalized
      </div>

      <div className="absolute -bottom-2 -left-6 hidden items-center gap-3 rounded-2xl border border-background-container bg-surface px-4 py-3 shadow-xl sm:flex">
        <div className="grid size-9 place-items-center rounded-xl bg-secondary-container text-on-secondary-container">
          <TrendingUp className="size-4" />
        </div>
        <div>
          <p className="text-xs text-on-background/70">Savings goal</p>
          <p className="text-sm font-semibold text-on-background">On track</p>
        </div>
      </div>
    </div>
  )
}
