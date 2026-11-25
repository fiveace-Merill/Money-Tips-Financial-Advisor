import type { ThemePreference } from "./preferencesStorage"
import {
  hasImportedPreferences,
  loadTheme,
  markPreferencesImported,
} from "./preferencesStorage"

export type PreferencesState = {
  theme: ThemePreference
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/settings/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error ?? "Unable to load your saved preferences.")
  }

  return (await response.json()) as T
}

export function getPreferences(): Promise<PreferencesState> {
  return request<PreferencesState>("preferences")
}

export function savePreferences(theme: ThemePreference): Promise<PreferencesState> {
  return request<PreferencesState>("preferences", {
    method: "PUT",
    body: JSON.stringify({ theme }),
  })
}

/** Imports the guest theme once, before the signed-in user state is set. */
export async function importGuestPreferences(): Promise<void> {
  if (hasImportedPreferences()) return

  await request<PreferencesState>("import", {
    method: "POST",
    body: JSON.stringify({ theme: loadTheme() }),
  })

  markPreferencesImported()
}
