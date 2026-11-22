"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/context/AuthContext"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const ctaHref = user ? "/chat" : "/signup"
  const ctaLabel = user ? "Go to chat" : "Get Started"

  return (
    <nav
      aria-label="Main navigation"
      className="landing-glass border-b border-background-container/70"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Money Tips home"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <Image src="/brand_logo.png" width={40} height={40} alt="" priority />
          <span className="text-xl font-bold tracking-tight text-on-background">
            Money Tips
          </span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button
            asChild
            className="landing-solid-primary rounded-full px-6 font-semibold shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
          >
            <Link href={ctaHref}>
              {ctaLabel} <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
          className="grid size-11 place-items-center rounded-xl border border-background-container text-on-background transition-colors hover:bg-background-container/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-background-container/70 px-5 pb-6 pt-3 md:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-on-background transition-colors hover:bg-background-container/60"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button asChild className="landing-solid-primary mt-3 w-full rounded-full font-semibold">
            <Link href={ctaHref} onClick={() => setIsOpen(false)}>
              {ctaLabel} <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
