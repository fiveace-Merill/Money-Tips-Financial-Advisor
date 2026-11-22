import type {
  BudgetInputs,
  BudgetResult,
  FinanceReferenceData,
  ProjectionInput,
  ProjectionResult,
  RiskAssumption,
  RiskProfile,
} from "@/types/finance"

/**
 * Shared, pure finance calculations.
 *
 * These functions are used by both the UI (for instant feedback) and the
 * finance API route. When the real backend arrives, move the calculations
 * server-side and keep the exported types as the contract.
 */

export const RISK_ASSUMPTIONS: Record<RiskProfile, RiskAssumption> = {
  conservative: {
    label: "Conservative",
    description: "Capital preservation with modest, steadier returns.",
    annualReturn: 4,
  },
  balanced: {
    label: "Balanced",
    description: "A mix of growth and stability across asset classes.",
    annualReturn: 7,
  },
  growth: {
    label: "Growth",
    description: "Long-term growth with larger short-term fluctuations.",
    annualReturn: 10,
  },
}

export const INVESTMENT_OPTIONS = [
  {
    id: "high-yield-savings",
    name: "High-yield savings",
    category: "Cash",
    description:
      "A low-risk home for an emergency fund or money you may need soon.",
    risk: "Low",
    horizon: "Access anytime",
    typicalReturn: 4,
    minimum: "$0",
  },
  {
    id: "government-bonds",
    name: "Government bonds",
    category: "Fixed income",
    description:
      "Regular interest payments and lower volatility for medium-term goals.",
    risk: "Low",
    horizon: "3–5 years",
    typicalReturn: 4.5,
    minimum: "$100",
  },
  {
    id: "index-funds",
    name: "Broad index funds",
    category: "Equities",
    description:
      "Wide diversification at low cost, tracking the overall market.",
    risk: "Medium",
    horizon: "5+ years",
    typicalReturn: 7,
    minimum: "$50",
  },
  {
    id: "diversified-etfs",
    name: "Diversified ETFs",
    category: "Multi-asset",
    description:
      "A single fund spread across shares, bonds, and sectors in one trade.",
    risk: "Medium",
    horizon: "5+ years",
    typicalReturn: 8,
    minimum: "$50",
  },
] as const

const round = (value: number) => Math.round(value * 100) / 100
const safe = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

/** Calculates a 50/30/20 breakdown and plain-language observations. */
export function calculateBudget(input: BudgetInputs): BudgetResult {
  const income = safe(input.income)
  const needs = safe(input.housing) + safe(input.bills) + safe(input.transport)
  const wants = safe(input.food) + safe(input.lifestyle) + safe(input.other)
  const totalExpenses = needs + wants
  const remaining = income - totalExpenses
  const savings = Math.max(0, remaining)
  const savingsRate = income > 0 ? (savings / income) * 100 : 0

  const percentOf = (amount: number) =>
    income > 0 ? (amount / income) * 100 : 0

  const allocations = [
    {
      label: "Needs",
      amount: needs,
      percent: percentOf(needs),
      targetPercent: 50,
    },
    {
      label: "Wants",
      amount: wants,
      percent: percentOf(wants),
      targetPercent: 30,
    },
    {
      label: "Savings",
      amount: savings,
      percent: percentOf(savings),
      targetPercent: 20,
    },
  ]

  const insights: string[] = []

  if (income === 0) {
    insights.push("Add your monthly income to see a personalised breakdown.")
  } else if (remaining < 0) {
    insights.push(
      `Your planned spending is ${formatCurrency(Math.abs(remaining))} more than your income each month. Look at reducing flexible spending first.`
    )
  } else if (savingsRate >= 20) {
    insights.push(
      `You're setting aside ${formatPercent(savingsRate)} of your income — ahead of the 20% savings guide. Nice work.`
    )
  } else if (savingsRate >= 10) {
    insights.push(
      `Your savings rate is ${formatPercent(savingsRate)}. Closing the gap to 20% would add ${formatCurrency(income * 0.2 - savings)} a month.`
    )
  } else {
    insights.push(
      `Your savings rate is ${formatPercent(savingsRate)}. Try to work towards saving 20% of your income, even if you start smaller.`
    )
  }

  if (allocations[0].percent > 50 && income > 0) {
    insights.push(
      `Needs take up ${formatPercent(allocations[0].percent)} of your income (the guide suggests 50%). Housing is usually the biggest lever here.`
    )
  }
  if (allocations[1].percent > 30 && income > 0) {
    insights.push(
      `Wants take up ${formatPercent(allocations[1].percent)} of your income (the guide suggests 30%). Small recurring subscriptions add up quickly.`
    )
  }
  if (insights.length === 1 && income > 0) {
    insights.push(
      "Your needs, wants, and savings are all close to the 50/30/20 guide."
    )
  }

  return {
    needs,
    wants,
    savings,
    totalExpenses,
    remaining,
    savingsRate,
    allocations,
    insights,
  }
}

/** Compounds monthly contributions to estimate a future portfolio value. */
export function calculateProjection(input: ProjectionInput): ProjectionResult {
  const monthlyContribution = safe(input.monthlyContribution)
  const years = Math.min(50, Math.max(1, Math.round(input.years)))
  const annualReturn = RISK_ASSUMPTIONS[input.profile].annualReturn
  const monthlyRate = annualReturn / 100 / 12

  let value = 0
  const points: ProjectionResult["points"] = []

  for (let month = 1; month <= years * 12; month += 1) {
    value = value * (1 + monthlyRate) + monthlyContribution
    if (month % 12 === 0) {
      points.push({
        year: month / 12,
        contributed: round(monthlyContribution * month),
        value: round(value),
      })
    }
  }

  const lastPoint = points[points.length - 1]
  const totalContributed = lastPoint?.contributed ?? 0
  const projectedValue = lastPoint?.value ?? 0

  return {
    profile: input.profile,
    annualReturn,
    monthlyContribution,
    years,
    totalContributed,
    projectedValue,
    estimatedGrowth: round(Math.max(0, projectedValue - totalContributed)),
    points,
  }
}

/** Payload served by /api/finance — the future backend contract. */
export function getFinanceReferenceData(): FinanceReferenceData {
  return {
    options: INVESTMENT_OPTIONS.map((option) => ({ ...option })),
    assumptions: { ...RISK_ASSUMPTIONS },
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}
