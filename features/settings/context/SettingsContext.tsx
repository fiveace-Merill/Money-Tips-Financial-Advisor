"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react"
import {
  DEFAULT_DISPLAY_NAME,
  initialsOf,
} from "@/features/settings/services/preferencesStorage"
import {
  getServerSystemThemeSnapshot,
  getServerThemeSnapshot,
  getServerNameSnapshot,
  getNameSnapshot,
  getSystemThemeSnapshot,
  getThemeSnapshot,
  subscribePreferences,
  subscribeSystemTheme,
  updateStoredName,
  updateStoredTheme,
} from "@/features/settings/services/preferencesStore"
import type { ThemePreference } from "@/features/settings/services/preferencesStorage"

interface SettingsContextValue {
  theme: ThemePreference
  resolvedTheme: "light" | "dark"
  setTheme: (theme: ThemePreference) => void
  displayName: string
  initials: string
  setDisplayName: (name: string) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribePreferences,
    getThemeSnapshot,
    getServerThemeSnapshot
  )
  const displayName = useSyncExternalStore(
    subscribePreferences,
    getNameSnapshot,
    getServerNameSnapshot
  )
  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    getServerSystemThemeSnapshot
  )

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme

  // The inline script in the root layout applies the class before first paint;
  // this keeps it in sync as the preference changes.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", resolvedTheme === "dark")
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const setTheme = useCallback((next: ThemePreference) => {
    updateStoredTheme(next)
  }, [])

  const setDisplayName = useCallback((next: string) => {
    updateStoredName(next.trim() || DEFAULT_DISPLAY_NAME)
  }, [])

  const value = useMemo<SettingsContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      displayName,
      initials: initialsOf(displayName),
      setDisplayName,
    }),
    [theme, resolvedTheme, setTheme, displayName, setDisplayName]
  )

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used inside a SettingsProvider")
  }
  return context
}
