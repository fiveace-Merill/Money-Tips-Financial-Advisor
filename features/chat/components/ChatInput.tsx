import { Send } from "lucide-react"
import { FAB } from "@/components/Button"
export default function ChatInput() {
  return (
    <form className="w-full flex justify-center items-center gap-3 lg:w-11/12">
      <input className="flex-auto px-2 py-[8px] focus:border focus:border-on-background bg-background-container/40 text-on-background-container rounded-2xl lg:px-4 lg:py-3" type="text" placeholder="Ask a financial question" />
      <FAB>
        <Send />
      </FAB>
    </form>

  )
}
