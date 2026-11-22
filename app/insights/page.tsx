import type { Metadata } from "next"
import { Suspense } from "react"
import AppHeader from "@/components/AppHeader"
import InsightsView from "@/features/insights/components/InsightsView"
import "@/styles/insights.css"

export const metadata: Metadata = {
  title: "Financial Insights | Money Tips",
  description: "Model your budget and explore long-term investment options.",
}

export default function Insights() {
  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <main>
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
              <div className="h-8 w-56 animate-pulse rounded-lg bg-background-container" />
              <div className="mt-8 h-64 animate-pulse rounded-3xl bg-background-container/60" />
            </div>
          }
        >
          <InsightsView />
        </Suspense>
      </main>
    </div>
  )
}
