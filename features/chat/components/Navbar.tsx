"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, Plus, X } from "lucide-react"
import SidebarMenu from "@/features/chat/components/SidebarMenu"
import { useChat } from "@/features/chat/context/ChatContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { activeSession, startNewChat } = useChat()

  return (
    <>
      <nav
        aria-label="Chat navigation"
        className="flex items-center gap-3 border-b border-background-container px-3 py-3 lg:px-4"
      >
        <button
          type="button"
          aria-label="Open sidebar"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="grid size-10 place-items-center rounded-xl text-on-background transition-colors hover:bg-background-container/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <Image src="/brand_logo.png" width={36} height={36} alt="" priority />
          <span className="text-lg font-bold text-on-background lg:text-xl">
            Money Tips
          </span>
        </Link>

        <p className="ml-auto hidden min-w-0 max-w-[14rem] truncate text-sm text-on-background/70 lg:block">
          {activeSession?.title ?? "New Chat"}
        </p>

        <button
          type="button"
          aria-label="Start a new chat"
          onClick={startNewChat}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-container/50 text-on-primary-container transition-colors hover:bg-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:ml-2"
        >
          <Plus className="size-5" />
        </button>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-xs flex-col bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-background-container px-4 py-3">
              <span className="font-semibold text-on-background">Menu</span>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setIsOpen(false)}
                className="grid size-9 place-items-center rounded-lg hover:bg-background-container/60"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <SidebarMenu onNavigate={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
