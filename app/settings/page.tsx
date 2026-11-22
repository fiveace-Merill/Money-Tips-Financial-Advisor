import type { Metadata } from "next"
import AppHeader from "@/components/AppHeader"
import SettingsView from "@/features/settings/components/SettingsView"

export const metadata: Metadata = {
  title: "Settings | Money Tips",
  description: "Personalise your Money Tips experience.",
}

export default function Settings() {
  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <main>
        <SettingsView />
      </main>
    </div>
  )
}
