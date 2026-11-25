import type { ThemePreference } from "@/features/settings/services/preferencesStorage"
import {
  clearGuestPreferences,
  DEFAULT_DISPLAY_NAME,
  loadDisplayName,
  loadTheme,
  saveDisplayName,
  saveTheme,
} from "@/features/settings/services/preferencesStorage"

const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listener) => listener())

/** External store so React can subscribe without setState-in-effect. */
export function subscribePreferences(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getThemeSnapshot(): ThemePreference {
  return loadTheme()
}

export function getServerThemeSnapshot(): ThemePreference {
  return "system"
}

export function getNameSnapshot(): string {
  return loadDisplayName()
}

export function getServerNameSnapshot(): string {
  return DEFAULT_DISPLAY_NAME
}

export function updateStoredTheme(theme: ThemePreference): void {
  saveTheme(theme)
  emit()
}

export function updateStoredName(name: string): void {
  saveDisplayName(name)
  emit()
}

export function clearStoredPreferences(): void {
  clearGuestPreferences()
  emit()
}

const DARK_QUERY = "(prefers-color-scheme: dark)"

export function subscribeSystemTheme(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener("change", listener)
  return () => media.removeEventListener("change", listener)
}

export function getSystemThemeSnapshot(): boolean {
  return typeof window !== "undefined" && window.matchMedia(DARK_QUERY).matches
}

export function getServerSystemThemeSnapshot(): boolean {
  return false
}
