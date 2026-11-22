import "@/styles/chat.css"
import ChatInput from "@/features/chat/components/ChatInput"
import Navbar from "@/features/chat/components/Navbar"
import SidebarWrapper from "@/features/chat/components/SidebarWrapper"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-[100dvh] max-h-[100dvh] flex-col bg-background lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-background-container bg-surface lg:h-full lg:w-72 lg:border-b-0 lg:border-r">
        <Navbar />
        <div className="hidden min-h-0 flex-1 overflow-y-auto lg:block">
          <SidebarWrapper />
        </div>
      </aside>

      <section className="flex min-h-0 flex-1 flex-col gap-3 p-2 lg:p-4">
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-background-container bg-surface/60">
          {children}
        </div>
        <ChatInput />
      </section>
    </main>
  )
}
