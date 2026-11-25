export type ThemePreference = "light" | "dark" | "system"

export const THEME_KEY = "money-tips.theme.v1"
export const NAME_KEY = "money-tips.display-name.v1"
export const PREFERENCES_IMPORT_KEY = "money-tips.preferences-import.v1"
export const DEFAULT_DISPLAY_NAME = "Oscar Piastri"

export function loadTheme(): ThemePreference {
  if (typeof window === "undefined") return "system"
  const stored = window.localStorage.getItem(THEME_KEY)
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system"
}

export function saveTheme(theme: ThemePreference): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(THEME_KEY, theme)
}

export function loadDisplayName(): string {
  if (typeof window === "undefined") return DEFAULT_DISPLAY_NAME
  const stored = window.localStorage.getItem(NAME_KEY)
  return stored?.trim() || DEFAULT_DISPLAY_NAME
}

export function saveDisplayName(name: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(NAME_KEY, name)
}

/** Removes guest preferences without clearing the one-time import marker. */
export function clearGuestPreferences(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(THEME_KEY)
  window.localStorage.removeItem(NAME_KEY)
}

export function markPreferencesImported(): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(PREFERENCES_IMPORT_KEY, "1")
}

export function hasImportedPreferences(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(PREFERENCES_IMPORT_KEY) === "1"
}

/** Builds up-to-two-letter avatar initials from a display name. */
export function initialsOf(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
  return initials || "OP"
}
