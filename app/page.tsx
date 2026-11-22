import Link from "next/link"
import { ArrowRight, ChartNoAxesCombined, PiggyBank, SwatchBook } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Footer from "@/components/Footer"

const products = [
  {
    icon: ChartNoAxesCombined,
    title: "Discover Effortless Savings",
    description: "Unlock your potential to save more. I'll help you set realistic goals, find opportunities to cut unnecessary expenses, and automatically track your progress. Watch your savings grow without stress.",
  },
  {
    icon: PiggyBank,
    title: "Navigate Investments with confidence",
    description: "Step into the world of investment with clarity. Whether you are a beginner or experienced, I'll provide insights and guidance tailored to your risk tolerance and financial aspirations, helping you make decisions for your future.",
  },
  {
    icon: SwatchBook,
    title: "Simplify Your Budgeting Journey",
    description: "Take control of your spending habits effortlessly. I'll help you visualize where your money goes, identify areas of improvement, and create a budget that works for you, giving you peace of mind and financial freedom.",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header />

      <main className="flex-1">
        <Hero />

        <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <h2 className="sr-only">Features</h2>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] landing-accent-text">
            Why Money Tips
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {products.map((product, idx) => {
              const Icon = product.icon
              return (
                <article
                  key={product.title}
                  className="group relative overflow-hidden rounded-3xl border border-background-container bg-surface p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 size-28 rounded-full bg-primary/5 blur-2xl transition-colors duration-300 group-hover:bg-primary/10"
                  />
                  <div className="relative flex items-start justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-primary-container/40 text-on-primary-container transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <Icon className="size-6" />
                    </span>
                    <span className="text-sm font-semibold text-on-background/70">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="relative mt-7 text-xl font-semibold leading-snug text-on-background">
                    {product.title}
                  </h3>
                  <p className="relative mt-4 text-[15px] leading-relaxed text-on-background/65">
                    {product.description}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section id="pricing" className="px-5 pb-24 sm:px-8">
          <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-background-container bg-surface px-6 py-16 text-center shadow-lg shadow-primary/5 sm:px-12">
            <div aria-hidden="true" className="landing-glow landing-glow--tertiary -z-10 left-[10%] top-[-60%] size-72" />
            <div aria-hidden="true" className="landing-glow landing-glow--primary -z-10 bottom-[-80%] right-[8%] size-72" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] landing-accent-text">
              Early Access
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-on-background sm:text-4xl">
              Start Your Financial Journey
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-on-background/70">
              Your AI advisor is free while we&apos;re in early access.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                className="landing-solid-primary rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
              >
                <Link href="/chat">
                  Chat Now <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
