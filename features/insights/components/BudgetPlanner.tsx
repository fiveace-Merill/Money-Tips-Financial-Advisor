"use client"

import { useMemo, useState } from "react"
import { Lightbulb, RotateCcw, Wallet } from "lucide-react"
import MoneyField from "@/features/insights/components/MoneyField"
import {
  calculateBudget,
  formatCurrency,
  formatPercent,
} from "@/features/insights/services/financeService"
import type { BudgetInputs } from "@/types/finance"

const INITIAL_INPUTS: BudgetInputs = {
  income: 5000,
  housing: 1600,
  bills: 450,
  transport: 350,
  food: 600,
  lifestyle: 400,
  other: 250,
}

const fields: {
  key: keyof BudgetInputs
  label: string
  max: number
  hint?: string
}[] = [
  { key: "income", label: "Monthly income", max: 20000, hint: "After tax" },
  { key: "housing", label: "Housing", max: 8000, hint: "Rent or bond" },
  { key: "bills", label: "Utilities & bills", max: 3000 },
  { key: "transport", label: "Transport", max: 3000 },
  { key: "food", label: "Food & groceries", max: 3000 },
  { key: "lifestyle", label: "Lifestyle & fun", max: 4000 },
  { key: "other", label: "Everything else", max: 4000 },
]

const barColors = ["bg-tertiary", "bg-secondary", "landing-solid-primary"]

export default function BudgetPlanner() {
  const [inputs, setInputs] = useState<BudgetInputs>(INITIAL_INPUTS)
  const result = useMemo(() => calculateBudget(inputs), [inputs])

  const update = (key: keyof BudgetInputs, value: number) => {
    setInputs((previous) => ({ ...previous, [key]: value }))
  }

  const stats = [
    { label: "Income", value: formatCurrency(inputs.income) },
    { label: "Total spending", value: formatCurrency(result.totalExpenses) },
    { label: "Left to save", value: formatCurrency(result.remaining) },
    { label: "Savings rate", value: formatPercent(result.savingsRate) },
  ]

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl border border-background-container bg-surface p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest landing-accent-text">
              <Wallet className="size-4" aria-hidden="true" />
              Step 1
            </p>
            <h2 className="mt-2 text-xl font-bold text-on-background">
              Your monthly numbers
            </h2>
            <p className="mt-1 text-sm text-on-background/75">
              Move a slider or type an amount — everything updates instantly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInputs(INITIAL_INPUTS)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium text-on-background/70 hover:bg-background-container/60 hover:text-on-background"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>

        <div className="mt-6 grid gap-x-5 gap-y-6 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className={field.key === "income" ? "sm:col-span-2" : ""}>
              <MoneyField
                label={field.label}
                hint={field.hint}
                max={field.max}
                value={inputs[field.key]}
                onChange={(value) => update(field.key, value)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-5">
        <section className="rounded-3xl border border-background-container bg-surface p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest landing-accent-text">
            Step 2
          </p>
          <h2 className="mt-2 text-xl font-bold text-on-background">
            Your 50/30/20 breakdown
          </h2>

          <div className="mt-6 space-y-5">
            {result.allocations.map((allocation, index) => (
              <div key={allocation.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-on-background">
                    {allocation.label}
                    <span className="ml-2 text-xs font-normal text-on-background/70">
                      guide {allocation.targetPercent}%
                    </span>
                  </span>
                  <span className="font-semibold text-on-background">
                    {formatPercent(allocation.percent)}
                    <span className="ml-2 text-xs font-normal text-on-background/70">
                      {formatCurrency(allocation.amount)}
                    </span>
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-background-container">
                  <div
                    className={`h-full rounded-full ${barColors[index]}`}
                    style={{ width: `${Math.min(100, allocation.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-background-container px-4 py-3"
              >
                <dt className="text-xs text-on-background/70">{stat.label}</dt>
                <dd className="mt-1 text-lg font-bold text-on-background">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-3xl border border-background-container bg-surface/70 p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-on-background">
            <Lightbulb className="size-4 landing-accent-text" aria-hidden="true" />
            What this means
          </h3>
          <ul className="mt-3 space-y-2.5">
            {result.insights.map((insight) => (
              <li
                key={insight}
                className="flex gap-2.5 text-sm leading-relaxed text-on-background/75"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                />
                {insight}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-on-background/70">
            Illustrative guidance based on the 50/30/20 rule — not personal
            financial advice.
          </p>
        </section>
      </div>
    </div>
  )
}
