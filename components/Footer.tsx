import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-background-container bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between text-on-background/70">
        <div className="flex items-center gap-2.5">
          <Image src="/brand_logo.png" width={32} height={32} alt="" />
          <span className="font-semibold text-on-background">Money Tips</span>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
          <a href="#features" className="transition-colors hover:text-primary">Features</a>
          <a href="#pricing" className="transition-colors hover:text-primary">Pricing</a>
          <a href="#about" className="transition-colors hover:text-primary">About</a>
          <Link href="/chat" className="transition-colors hover:text-primary">Chat</Link>
        </nav>

        <p className="text-xs">
          © {new Date().getFullYear()} Money Tips. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
