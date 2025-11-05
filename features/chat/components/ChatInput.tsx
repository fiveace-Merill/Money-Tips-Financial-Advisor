import { ArrowRight } from "lucide-react"
import { FAB } from "@/components/Button"
export default function ChatInput() {
  return (
    <form className="flex justify-center items-center gap-3 lg:w-10/12">
      <input className="flex-auto px-4 py-3 focus:border focus:border-on-background bg-background-container/40 text-on-background-container rounded-2xl" type="text" placeholder="Ask a financial question" />
      <FAB>
        <ArrowRight />
      </FAB>
    </form>

  )
}
