import ChatInput from '@/features/chat/components/ChatInput'
import Navbar from '@/features/chat/components/Navbar'
import SidebarWrapper from '@/features/chat/components/SidebarWrapper'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative h-screen max-h-screen flex flex-col items-stretch gap-3 lg:flex-row">
      <div className="h-auto basis-1/12 flex-col lg:min-h-screen lg:basis-3/12 lg:flex lg:border-2 lg:border-background-container lg:bg-background-container/30">
        <Navbar />
        <div className="hidden lg:h-full lg:flex">
          <SidebarWrapper />
        </div>
      </div>
      <section className="w-full basis-11/12 p-2 flex-auto max-w-screen max-h-screen flex flex-col justify-between lg:items-center lg:rounded-2xl lg:gap-3 lg:basis-9/12 lg:min-h-screen">
        <div className="basis-11/12 w-full h-full rounded-xl lg:flex-1 lg:pt-3 bg-background-container/20 border-2 border-background-container lg:w-11/12 lg:rounded-2xl">
          {children}
        </div>
        <footer className="w-full basis-1/12 flex justify-center lg:justify-center">
          <ChatInput />
        </footer>
      </section>
    </main>
  )
}
