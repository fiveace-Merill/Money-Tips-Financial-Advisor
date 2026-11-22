/** Monthly figures used by the 50/30/20 budget simulator. */
export interface BudgetInputs {
  income: number
  housing: number
  bills: number
  transport: number
  food: number
  lifestyle: number
  other: number
}

export interface BudgetAllocation {
  label: string
  amount: number
  percent: number
  targetPercent: number
}

export interface BudgetResult {
  needs: number
  wants: number
  savings: number
  totalExpenses: number
  remaining: number
  savingsRate: number
  allocations: BudgetAllocation[]
  insights: string[]
}

export type RiskProfile = "conservative" | "balanced" | "growth"

export interface InvestmentOption {
  id: string
  name: string
  category: string
  description: string
  risk: "Low" | "Medium" | "High"
  horizon: string
  typicalReturn: number
  minimum: string
}

export interface RiskAssumption {
  label: string
  description: string
  annualReturn: number
}

export interface ProjectionInput {
  monthlyContribution: number
  years: number
  profile: RiskProfile
}

export interface ProjectionPoint {
  year: number
  contributed: number
  value: number
}

export interface ProjectionResult {
  profile: RiskProfile
  annualReturn: number
  monthlyContribution: number
  years: number
  totalContributed: number
  projectedValue: number
  estimatedGrowth: number
  points: ProjectionPoint[]
}

/** Reference data returned by the finance API and shared with the client. */
export interface FinanceReferenceData {
  options: InvestmentOption[]
  assumptions: Record<RiskProfile, RiskAssumption>
}
