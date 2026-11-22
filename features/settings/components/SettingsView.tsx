"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Check,
  Info,
  Loader2,
  LogOut,
  Mail,
  Monitor,
  Moon,
  RotateCcw,
  Save,
  Sun,
  Trash2,
  UserRound,
} from "lucide-react"
import { useSettings } from "@/features/settings/context/SettingsContext"
import { useAuth } from "@/features/auth/context/AuthContext"
import { useChat } from "@/features/chat/context/ChatContext"
import {
  DEFAULT_DISPLAY_NAME,
  type ThemePreference,
} from "@/features/settings/services/preferencesStorage"

const themes: {
  id: ThemePreference
  label: string
  description: string
  icon: typeof Sun
}[] = [
  { id: "light", label: "Light", description: "Bright and clear", icon: Sun },
  { id: "dark", label: "Dark", description: "Easy on the eyes", icon: Moon },
  { id: "system", label: "System", description: "Match your device", icon: Monitor },
]

export default function SettingsView() {
  const {
    theme,
    resolvedTheme,
    setTheme,
    displayName,
    initials,
    setDisplayName,
  } = useSettings()
  const { sessions, clearAllSessions } = useChat()
  const { user, logout } = useAuth()
  // null means "follow the saved name"; editing stores an unsaved draft.
  const [draft, setDraft] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const nameValue = draft ?? displayName

  const conversationCount = sessions.filter((session) =>
    session.messages.some((message) => message.role === "user")
  ).length

  const saveName = () => {
    const next = nameValue.trim()
    if (!next) return
    setDisplayName(next)
    setDraft(null)
    setSaved(true)
  }

  const resetPreferences = () => {
    setTheme("system")
    setDisplayName(DEFAULT_DISPLAY_NAME)
    setDraft(null)
    setSaved(false)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] landing-accent-text">
        Make it yours
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-on-background sm:text-4xl">
        Settings
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-background/75 sm:text-base">
        Personalise how Money Tips looks and feels. Your preferences are saved
        on this device and applied everywhere.
      </p>

      <div className="mt-9 space-y-5">
        <section className="rounded-3xl border border-background-container bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-on-background">Appearance</h2>
          <p className="mt-1 text-sm text-on-background/75">
            Choose a theme for the whole application.
          </p>

          <div
            role="radiogroup"
            aria-label="Colour theme"
            className="mt-6 grid gap-3 sm:grid-cols-3"
          >
              {themes.map(({ id, label, description, icon: Icon }) => {
                const isSelected = theme === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setTheme(id)}
                    className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isSelected
                        ? "border-primary bg-primary-container/30"
                        : "border-background-container hover:bg-background-container/50"
                    }`}
                  >
                    <span
                      className={`grid size-10 place-items-center rounded-xl ${
                        isSelected
                          ? "landing-solid-primary"
                          : "bg-background-container text-on-background"
                      }`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="mt-3 text-sm font-semibold text-on-background">
                      {label}
                    </span>
                    <span className="mt-0.5 text-xs text-on-background/70">
                      {description}
                    </span>
                    {isSelected && (
                      <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full landing-solid-primary">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                )
              })}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-on-background/70">
            <Info className="size-3.5" aria-hidden="true" />
            Currently showing the {resolvedTheme} theme.
          </p>
        </section>

        <section className="rounded-3xl border border-background-container bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-on-background">
            <UserRound className="size-5 landing-accent-text" aria-hidden="true" />
            Profile
          </h2>
          <p className="mt-1 text-sm text-on-background/75">
            {user
              ? "Used when you're browsing without an account. Your account name appears in chat."
              : "This name appears in your chat messages and sidebar."}
          </p>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="display-name"
                className="text-sm font-medium text-on-background"
              >
                Display name
              </label>
              <input
                id="display-name"
                type="text"
                maxLength={40}
                value={nameValue}
                onChange={(event) => {
                  setDraft(event.target.value)
                  setSaved(false)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveName()
                }}
                className="mt-2 w-full rounded-xl border border-background-container bg-surface px-4 py-3 text-sm text-on-background outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-3 sm:pb-0.5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container">
                {initials}
              </span>
              <button
                type="button"
                onClick={saveName}
                disabled={!nameValue.trim() || nameValue.trim() === displayName}
                className="landing-solid-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="size-4" aria-hidden="true" />
                Save name
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-on-background/70" role="status">
            {saved ? "Your display name has been saved." : "Changes are stored on this device."}
          </p>
        </section>

        <section className="rounded-3xl border border-background-container bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-on-background">
            <Mail className="size-5 landing-accent-text" aria-hidden="true" />
            Account
          </h2>

          {user ? (
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-background-container px-4 py-4 sm:flex-row sm:items-center">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container">
                {user.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-on-background">
                  {user.name}
                </p>
                <p className="truncate text-xs text-on-background/70">
                  {user.email}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setLoggingOut(true)
                  try {
                    await logout()
                  } finally {
                    setLoggingOut(false)
                  }
                }}
                disabled={loggingOut}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-background-container px-4 py-2.5 text-sm font-semibold text-on-background transition-colors hover:bg-background-container/60 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <LogOut className="size-4" aria-hidden="true" />
                )}
                Log out
              </button>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-background-container px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-on-background/75">
                You&apos;re browsing as a guest. Sign in to keep your details
                ready on every visit.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="rounded-xl border border-background-container px-4 py-2.5 text-sm font-semibold text-on-background transition-colors hover:bg-background-container/60"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="landing-solid-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-background-container bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-on-background">Conversations</h2>
          <p className="mt-1 text-sm text-on-background/75">
            You have {conversationCount} saved conversation
            {conversationCount === 1 ? "" : "s"} on this device.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-background-container px-4 py-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-on-background">
                Clear all conversations
              </p>
              <p className="text-xs text-on-background/70">
                Removes saved chats. This cannot be undone.
              </p>
            </div>
            {confirmClear ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded-xl px-3.5 py-2 text-sm font-medium text-on-background/75 hover:bg-background-container/60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearAllSessions()
                    setConfirmClear(false)
                  }}
                  className="rounded-xl bg-destructive px-3.5 py-2 text-sm font-semibold text-on-destructive hover:opacity-90"
                >
                  Clear
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={conversationCount === 0}
                className="rounded-xl border border-destructive/30 px-3.5 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear history
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={resetPreferences}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-on-background/75 hover:bg-background-container/60 hover:text-on-background"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset preferences to defaults
          </button>
        </section>

        <section className="rounded-3xl border border-background-container bg-surface/70 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-on-background">About</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-on-background/70">Application</dt>
              <dd className="font-semibold text-on-background">
                Money Tips Financial Advisor
              </dd>
            </div>
            <div>
              <dt className="text-on-background/70">Version</dt>
              <dd className="font-semibold text-on-background">1.0.0 (frontend)</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-on-background/70">
            Account details are stored securely in PostgreSQL. Conversations and
            preferences are still stored on this device. Financial guidance
            shown here is illustrative and is not personal financial advice.
          </p>
        </section>
      </div>
    </div>
  )
}
