"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { useAuth } from "@/features/auth/context/AuthContext"
import { useChat } from "@/features/chat/context/ChatContext"

const sections = [
  { href: "/chat", label: "Chat" },
  { href: "/history", label: "History" },
  { href: "/insights", label: "Insights" },
  { href: "/settings", label: "Settings" },
]

export default function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { startNewChat } = useChat()
  const { user } = useAuth()

  const startChat = () => {
    startNewChat()
    router.push("/chat")
  }

  return (
    <header className="landing-glass sticky top-0 z-40 border-b border-background-container">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Money Tips home"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Image src="/brand_logo.png" width={38} height={38} alt="" priority />
            <span className="text-lg font-bold tracking-tight text-on-background sm:text-xl">
              Money Tips
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {user && (
              <Link
                href="/settings"
                title={user.email}
                className="hidden items-center gap-2 rounded-full border border-background-container px-2.5 py-1.5 transition-colors hover:bg-background-container/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
              >
                <span className="grid size-7 place-items-center rounded-full bg-secondary-container text-[11px] font-bold text-on-secondary-container">
                  {user.initials}
                </span>
                <span className="max-w-24 truncate text-sm font-medium text-on-background">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            )}
            <button
              type="button"
              onClick={startChat}
              className="landing-solid-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm hover:-translate-y-0.5 sm:px-5"
            >
              <Plus className="size-4" />
              New chat
            </button>
          </div>
        </div>

        <nav aria-label="App sections" className="flex gap-1 overflow-x-auto">
          {sections.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "landing-accent-text border-primary"
                    : "border-transparent text-on-background/70 hover:text-on-background"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
