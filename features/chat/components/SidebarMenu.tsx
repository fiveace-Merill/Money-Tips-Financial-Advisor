"use client"

import Link from "next/link"
import {
  EllipsisVertical,
  History,
  MessageSquare,
  Plus,
  ReceiptText,
  Settings,
  Trash2,
  TrendingUp,
} from "lucide-react"
import { useChat } from "@/features/chat/context/ChatContext"
import { useSettings } from "@/features/settings/context/SettingsContext"

const sections = [
  { icon: History, label: "Chat History", href: "/history" },
  { icon: ReceiptText, label: "Budget Options", href: "/insights?view=budget" },
  {
    icon: TrendingUp,
    label: "Investment Options",
    href: "/insights?view=investments",
  },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function SidebarMenu({
  onNavigate = () => {},
}: {
  onNavigate?: () => void
}) {
  const {
    sessions,
    activeSession,
    startNewChat,
    selectSession,
    deleteSession,
  } = useChat()
  const { displayName, initials } = useSettings()

  return (
    <div className="flex min-h-full flex-col gap-2 p-3">
      <button
        type="button"
        onClick={() => {
          startNewChat()
          onNavigate()
        }}
        className="landing-solid-primary flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold shadow-sm hover:-translate-y-0.5"
      >
        <Plus className="size-4" />
        New Chat
      </button>

      <p className="mt-3 px-2 text-[11px] font-semibold uppercase tracking-widest text-on-background/60">
        Recent chats
      </p>
      <ul className="mt-1 space-y-1">
        {sessions.map((session) => {
          const isActive = session.id === activeSession?.id
          return (
            <li key={session.id}>
              <div
                className={`group flex items-center gap-1 rounded-xl px-1 transition-colors ${
                  isActive
                    ? "bg-primary-container/40"
                    : "hover:bg-background-container/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    selectSession(session.id)
                    onNavigate()
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2.5 text-left"
                >
                  <MessageSquare
                    className={`size-4 shrink-0 ${
                      isActive
                        ? "text-on-primary-container"
                        : "text-on-background/50"
                    }`}
                  />
                  <span className="truncate text-sm text-on-background">
                    {session.title}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`Delete chat: ${session.title}`}
                  onClick={() => deleteSession(session.id)}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-on-background/50 opacity-0 transition hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <nav
        aria-label="Chat sections"
        className="mt-auto space-y-1 border-t border-background-container pt-3"
      >
        {sections.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-on-background/80 transition-colors hover:bg-background-container/60 hover:text-on-background"
          >
            <Icon className="size-4 text-primary" />
            {label}
          </Link>
        ))}
      </nav>

      <Link
        href="/settings"
        onClick={onNavigate}
        className="mt-2 flex items-center gap-3 rounded-xl border-t border-background-container px-3 py-3 transition-colors hover:bg-background-container/60"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-container text-xs font-bold text-on-secondary-container">
          {initials}
        </span>
        <span className="truncate text-sm font-medium text-on-background">
          {displayName}
        </span>
        <EllipsisVertical className="ml-auto size-4 shrink-0 text-on-background/50" />
      </Link>
    </div>
  )
}
