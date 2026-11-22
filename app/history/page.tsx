import type { Metadata } from "next"
import AppHeader from "@/components/AppHeader"
import HistoryView from "@/features/history/components/HistoryView"

export const metadata: Metadata = {
  title: "Chat History | Money Tips",
  description: "Revisit and manage your financial advisor conversations.",
}

export default function History() {
  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <main>
        <HistoryView />
      </main>
    </div>
  )
}
