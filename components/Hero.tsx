import Link from "next/link"
import { ArrowRight, PiggyBank, ShieldCheck, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatPreview from "@/components/ChatPreview"

const pillars = [
  { icon: PiggyBank, label: "Smart Savings" },
  { icon: TrendingUp, label: "Investments" },
  { icon: ShieldCheck, label: "Budgeting" },
]

export default function Hero() {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-surface"
    >
      <div aria-hidden="true" className="landing-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="landing-glow landing-glow--primary -z-10 left-[-12%] top-[-18%] size-[420px]" />
      <div aria-hidden="true" className="landing-glow landing-glow--secondary -z-10 bottom-[-25%] right-[-10%] size-[460px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-28">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-on-background/70">
            <Sparkles className="size-3.5 text-primary" />
            AI Financial Advisor
          </span>

          <h1 className="mt-6 text-[clamp(2.6rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-tight text-on-background">
            Meet your personal <span className="landing-text-gradient">AI advisor</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-on-background/70 lg:mx-0">
            I am here to simplify your financial journey. Together we will navigate your money with smart personalized advice to help you reach your goals faster and live the life you want.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Button
              asChild
              className="landing-solid-primary rounded-full px-7 py-6 text-base font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href="/chat">
                Chat Now <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-background-container bg-surface px-7 py-6 text-base font-semibold text-on-background transition-all hover:bg-background-container/50"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm font-medium text-on-background/70 lg:justify-start">
            {pillars.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <ChatPreview />
      </div>
    </section>
  )
}
