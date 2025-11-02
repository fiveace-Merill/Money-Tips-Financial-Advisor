import Navbar from "@/features/chat/components/Navbar"
import { ChatInput } from "@/features/chat/components/ChatInput"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex flex-col min-h-screen max-h-screen">
      <Navbar />
      <div className="mt-[75px] flex-1 py-12 px-3 flex flex-col justify-start items-center overflow-y-scroll">
        {children}
      </div>
      <footer className="fixed inset-x-0 bottom-5 basis-2/12 px-3 w-full mx-auto">
        <ChatInput />
      </footer>
    </main>
  )
}
