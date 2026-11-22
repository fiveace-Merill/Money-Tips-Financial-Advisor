import type { FinanceReferenceData } from "@/types/finance"

/** Client gateway for the finance reference-data endpoint. */
export async function requestFinanceReferenceData(): Promise<FinanceReferenceData> {
  const response = await fetch("/api/finance")

  if (!response.ok) {
    throw new Error("Insight data is temporarily unavailable. Please try again.")
  }

  return (await response.json()) as FinanceReferenceData
}
