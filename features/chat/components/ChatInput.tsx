import { ArrowRight } from "lucide-react"
import { FAB } from "@/components/Button"
export function ChatInput() {
  return (
    <form className="flex justify-center items-center gap-3">
      <input className="basis-9/12 px-4 py-3 focus:border focus:border-on-background bg-background-container/40 text-on-background-container rounded-2xl" type="text" placeholder="Ask a financial question" />
      <FAB>
        <ArrowRight />
      </FAB>
    </form>

  )
}
