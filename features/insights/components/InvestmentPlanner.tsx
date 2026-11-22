"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  RefreshCw,
  TrendingUp,
} from "lucide-react"
import {
  calculateProjection,
  formatCurrency,
  RISK_ASSUMPTIONS,
} from "@/features/insights/services/financeService"
import { requestFinanceReferenceData } from "@/features/insights/services/financeApi"
import type {
  FinanceReferenceData,
  InvestmentOption,
  RiskProfile,
} from "@/types/finance"

const profiles: RiskProfile[] = ["conservative", "balanced", "growth"]

const riskStyles: Record<InvestmentOption["risk"], string> = {
  Low: "bg-secondary-container text-on-secondary-container",
  Medium: "bg-primary-container text-on-primary-container",
  High: "bg-destructive/10 text-destructive",
}

export default function InvestmentPlanner() {
  const [data, setData] = useState<FinanceReferenceData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [contribution, setContribution] = useState(300)
  const [years, setYears] = useState(20)
  const [profile, setProfile] = useState<RiskProfile>("balanced")

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await requestFinanceReferenceData())
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Insight data could not be loaded."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    void Promise.resolve().then(() => {
      if (!cancelled) void load()
    })

    return () => {
      cancelled = true
    }
  }, [load])

  const assumptions = data?.assumptions ?? RISK_ASSUMPTIONS
  const projection = useMemo(
    () => calculateProjection({ monthlyContribution: contribution, years, profile }),
    [contribution, years, profile]
  )

  const chartPoints = useMemo(() => {
    if (!projection.points.length) return []
    const step = Math.max(1, Math.ceil(projection.points.length / 12))
    return projection.points.filter(
      (point, index) =>
        index % step === 0 || index === projection.points.length - 1
    )
  }, [projection.points])
  const maxValue = Math.max(1, ...chartPoints.map((point) => point.value))

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="rounded-3xl border border-background-container bg-surface p-5 shadow-sm sm:p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest landing-accent-text">
            <TrendingUp className="size-4" aria-hidden="true" />
            Your plan
          </p>
          <h2 className="mt-2 text-xl font-bold text-on-background">
            Project your growth
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <label
                htmlFor="investment-contribution"
                className="text-sm font-medium text-on-background"
              >
                Monthly contribution
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-background-container bg-surface px-3 py-2 transition-colors focus-within:border-primary">
                <span aria-hidden="true" className="text-sm text-on-background/70">$</span>
                <input
                  id="investment-contribution"
                  type="number"
                  min={0}
                  step={25}
                  value={contribution}
                  onChange={(event) => {
                    const parsed = Number(event.target.value)
                    setContribution(Number.isFinite(parsed) ? Math.max(0, parsed) : 0)
                  }}
                  className="w-full min-w-0 bg-transparent text-sm font-semibold text-on-background outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <input
                type="range"
                min={0}
                max={3000}
                step={25}
                value={Math.min(contribution, 3000)}
                onChange={(event) => setContribution(Number(event.target.value))}
                aria-label="Monthly contribution slider"
                className="insight-range mt-3 w-full"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="investment-years"
                  className="text-sm font-medium text-on-background"
                >
                  Time horizon
                </label>
                <span className="text-sm font-semibold text-on-background">
                  {years} years
                </span>
              </div>
              <input
                id="investment-years"
                type="range"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(event) => setYears(Number(event.target.value))}
                className="insight-range mt-4 w-full"
              />
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-on-background">
                Risk profile
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {profiles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={profile === item}
                    onClick={() => setProfile(item)}
                    className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors ${
                      profile === item
                        ? "landing-solid-primary border-transparent"
                        : "border-background-container text-on-background/75 hover:bg-background-container/60"
                    }`}
                  >
                    {assumptions[item].label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-on-background/70">
                {assumptions[profile].description} Assumed return:{" "}
                {assumptions[profile].annualReturn}% per year.
              </p>
            </fieldset>
          </div>
        </section>

        <section className="rounded-3xl border border-background-container bg-surface p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest landing-accent-text">
            Estimated outcome
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-on-background sm:text-4xl">
            {formatCurrency(projection.projectedValue)}
          </p>
          <p className="mt-1 text-sm text-on-background/70">
            after {years} years of {formatCurrency(contribution)} a month
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-background-container px-4 py-3">
              <dt className="text-xs text-on-background/70">You contribute</dt>
              <dd className="mt-1 text-lg font-bold text-on-background">
                {formatCurrency(projection.totalContributed)}
              </dd>
            </div>
            <div className="rounded-2xl border border-background-container px-4 py-3">
              <dt className="text-xs text-on-background/70">Estimated growth</dt>
              <dd className="mt-1 text-lg font-bold landing-accent-text">
                {formatCurrency(projection.estimatedGrowth)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex h-40 items-end gap-1" aria-hidden="true">
            {chartPoints.map((point) => {
              const contributedPercent = (point.contributed / maxValue) * 100
              const growthPercent =
                ((point.value - point.contributed) / maxValue) * 100
              return (
                <div
                  key={point.year}
                  title={`Year ${point.year}: ${formatCurrency(point.value)}`}
                  className="insight-bar flex h-full min-w-0 flex-1 flex-col justify-end"
                >
                  <div
                    className="landing-solid-primary w-full rounded-t"
                    style={{ height: `${growthPercent}%` }}
                  />
                  <div
                    className="w-full bg-primary-container"
                    style={{ height: `${contributedPercent}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-2 flex justify-between text-xs text-on-background/70" aria-hidden="true">
            <span>Year 1</span>
            <span>Year {projection.years}</span>
          </div>
          <p className="sr-only">
            Projected value {formatCurrency(projection.projectedValue)}, made up
            of {formatCurrency(projection.totalContributed)} contributed and{" "}
            {formatCurrency(projection.estimatedGrowth)} of estimated growth.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-on-background/70">
            Illustrative only. Returns are not guaranteed and this is not
            personal financial advice.
          </p>
        </section>
      </div>

      <section className="rounded-3xl border border-background-container bg-surface/60 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest landing-accent-text">
              Explore
            </p>
            <h2 className="mt-2 text-xl font-bold text-on-background">
              Investment options
            </h2>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-container/50 landing-accent-text">
            <ChartNoAxesCombined className="size-5" aria-hidden="true" />
          </span>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-on-background"
          >
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-semibold text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-background-container bg-surface"
              />
            ))}
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data?.options.map((option) => (
              <li key={option.id}>
                <article className="flex h-full flex-col rounded-2xl border border-background-container bg-surface p-5 shadow-sm transition-colors hover:border-primary/40">
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid size-10 place-items-center rounded-xl bg-secondary-container text-on-secondary-container">
                      <ChartNoAxesCombined className="size-5" aria-hidden="true" />
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${riskStyles[option.risk]}`}
                    >
                      {option.risk} risk
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold text-on-background">
                    {option.name}
                  </h3>
                  <p className="text-xs landing-accent-text">{option.category}</p>
                  <p className="mt-2 text-sm leading-relaxed text-on-background/75">
                    {option.description}
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
                    <dt className="text-on-background/70">Typical return</dt>
                    <dd className="text-right font-semibold text-on-background">
                      {option.typicalReturn}% / yr
                    </dd>
                    <dt className="text-on-background/70">Horizon</dt>
                    <dd className="text-right font-medium text-on-background">
                      {option.horizon}
                    </dd>
                    <dt className="text-on-background/70">From</dt>
                    <dd className="text-right font-medium text-on-background">
                      {option.minimum}
                    </dd>
                  </dl>
                  <Link
                    href="/chat"
                    className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-background-container px-3 py-2.5 text-xs font-semibold text-on-background transition-colors hover:border-primary/50 hover:bg-primary-container/30"
                  >
                    Ask your advisor <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
