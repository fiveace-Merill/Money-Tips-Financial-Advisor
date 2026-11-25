"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { useAuth } from "@/features/auth/context/AuthContext"
import { getPreferences, savePreferences } from "@/features/settings/services/preferencesApi"
import {
  DEFAULT_DISPLAY_NAME,
  initialsOf,
  type ThemePreference,
} from "@/features/settings/services/preferencesStorage"
import {
  clearStoredPreferences,
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

interface SettingsContextValue {
  theme: ThemePreference
  resolvedTheme: "light" | "dark"
  setTheme: (theme: ThemePreference) => void
  displayName: string
  initials: string
  setDisplayName: (name: string) => void
}

type RemoteTheme = {
  userId: string
  theme: ThemePreference
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const authInitials = user?.initials ?? ""

  const localTheme = useSyncExternalStore(
    subscribePreferences,
    getThemeSnapshot,
    getServerThemeSnapshot
  )
  const localDisplayName = useSyncExternalStore(
    subscribePreferences,
    getNameSnapshot,
    getServerNameSnapshot
  )
  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    getServerSystemThemeSnapshot
  )

  const [remoteTheme, setRemoteTheme] = useState<RemoteTheme | null>(null)
  const skipSyncRef = useRef(false)
  const previousUserIdRef = useRef<string | null>(null)

  const remoteLoaded = Boolean(userId && remoteTheme?.userId === userId)
  const theme: ThemePreference = userId
    ? (remoteTheme?.userId === userId ? remoteTheme.theme : "system")
    : localTheme
  const displayName = user ? user.name : localDisplayName
  const initials = user
    ? authInitials || initialsOf(user.name)
    : initialsOf(localDisplayName)

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme

  // Load database-backed theme after auth has finished importing guest data.
  useEffect(() => {
    if (!userId) return

    let active = true

    void getPreferences()
      .then((state) => {
        if (!active) return
        skipSyncRef.current = true
        setRemoteTheme({ userId, theme: state.theme })
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [userId])

  // Signed-in themes never live in guest localStorage.
  useEffect(() => {
    const currentUserId = userId
    const previousUserId = previousUserIdRef.current
    previousUserIdRef.current = currentUserId

    if (previousUserId && !currentUserId) {
      clearStoredPreferences()
      skipSyncRef.current = false
    }
  }, [userId])

  // Debounced database sync for signed-in users.
  useEffect(() => {
    if (!userId || !remoteLoaded) return

    if (skipSyncRef.current) {
      skipSyncRef.current = false
      return
    }

    const timer = setTimeout(() => {
      void savePreferences(theme).catch(() => undefined)
    }, 400)

    return () => clearTimeout(timer)
  }, [theme, userId, remoteLoaded])

  // The inline script in the root layout applies the class before first paint;
  // this keeps it in sync as the preference changes.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", resolvedTheme === "dark")
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const setTheme = useCallback(
    (next: ThemePreference) => {
      if (userId) {
        setRemoteTheme({ userId, theme: next })
        return
      }
      updateStoredTheme(next)
    },
    [userId]
  )

  const setDisplayName = useCallback(
    (next: string) => {
      if (userId) return
      updateStoredName(next.trim() || DEFAULT_DISPLAY_NAME)
    },
    [userId]
  )

  const value = useMemo<SettingsContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      displayName,
      initials,
      setDisplayName,
    }),
    [theme, resolvedTheme, setTheme, displayName, initials, setDisplayName]
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
