"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChartNoAxesCombined, Wallet } from "lucide-react"
import BudgetPlanner from "@/features/insights/components/BudgetPlanner"
import InvestmentPlanner from "@/features/insights/components/InvestmentPlanner"

type View = "budget" | "investments"

const tabs: { id: View; label: string; icon: typeof Wallet }[] = [
  { id: "budget", label: "Budget planner", icon: Wallet },
  { id: "investments", label: "Investment options", icon: ChartNoAxesCombined },
]

export default function InsightsView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view: View = searchParams.get("view") === "investments" ? "investments" : "budget"

  const selectView = (next: View) => {
    router.replace(`/insights?view=${next}`, { scroll: false })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] landing-accent-text">
        Tools & guidance
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-on-background sm:text-4xl">
        Financial insights
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-background/75 sm:text-base">
        Model your monthly budget and explore long-term investing. Adjust the
        numbers to see how small changes shape your financial picture.
      </p>

      <div
        role="tablist"
        aria-label="Insight tools"
        className="mt-8 inline-flex flex-wrap gap-2 rounded-2xl border border-background-container bg-surface p-1.5"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = view === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`insights-tab-${id}`}
              aria-selected={isActive}
              aria-controls={`insights-panel-${id}`}
              onClick={() => selectView(id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "landing-solid-primary shadow-sm"
                  : "text-on-background/75 hover:bg-background-container/60 hover:text-on-background"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`insights-panel-${view}`}
        aria-labelledby={`insights-tab-${view}`}
        className="mt-6"
      >
        {view === "budget" ? <BudgetPlanner /> : <InvestmentPlanner />}
      </div>
    </div>
  )
}
