"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { AuthFieldErrors } from "@/types/auth";
import {
  fieldErrorsFrom,
  loginSchema,
  registerSchema,
} from "@/lib/auth/validation";
import { useAuth } from "../context/AuthContext";
import { AuthApiError } from "../services/authApi";

const fieldClass =
  "mt-2 w-full rounded-xl border border-background-container bg-surface px-4 py-3 text-sm text-on-background outline-none transition-colors placeholder:text-on-background/45 focus:border-primary aria-[invalid=true]:border-destructive";

const labelClass = "text-sm font-medium text-on-background";
const errorTextClass = "mt-1.5 text-xs text-destructive";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { user, loading, login, register, logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  const strength = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (!loading && user) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary-container/25 p-5">
        <p className="text-sm font-semibold text-on-background">
          You&apos;re already signed in
        </p>
        <p className="mt-1 break-all text-sm text-on-background/75">
          {user.email}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="landing-solid-primary inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            Continue to chat
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center rounded-xl border border-background-container px-4 py-2.5 text-sm font-medium text-on-background/80 transition-colors hover:bg-background-container/60"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const payload = isSignup
      ? { name, email, password, confirmPassword, terms }
      : { email, password };

    const parsed = isSignup
      ? registerSchema.safeParse(payload)
      : loginSchema.safeParse(payload);

    if (!parsed.success) {
      setFieldErrors(fieldErrorsFrom(parsed.error) as AuthFieldErrors);
      setError("Please check the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        await register(
          parsed.data as Parameters<typeof register>[0]
        );
      } else {
        await login(parsed.data as Parameters<typeof login>[0]);
      }
      router.push("/chat");
    } catch (submissionError) {
      if (submissionError instanceof AuthApiError) {
        setError(submissionError.message);
        setFieldErrors(
          (submissionError.fieldErrors as AuthFieldErrors | undefined) ?? {}
        );
        if (submissionError.status === 401) setPassword("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {isSignup && (
        <div>
          <label htmlFor="auth-name" className={labelClass}>
            Full name
          </label>
          <input
            id="auth-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={60}
            placeholder="Ada Lovelace"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "auth-name-error" : undefined}
            className={fieldClass}
          />
          {fieldErrors.name && (
            <p id="auth-name-error" className={errorTextClass}>
              {fieldErrors.name}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="auth-email" className={labelClass}>
          Email address
        </label>
        <input
          id="auth-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "auth-email-error" : undefined}
          className={fieldClass}
        />
        {fieldErrors.email && (
          <p id="auth-email-error" className={errorTextClass}>
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="auth-password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="auth-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={isSignup ? "At least 8 characters" : "Your password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "auth-password-error" : undefined
            }
            className={`${fieldClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-on-background/60 transition-colors hover:bg-background-container/60 hover:text-on-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p id="auth-password-error" className={errorTextClass}>
            {fieldErrors.password}
          </p>
        )}

        {isSignup && password.length > 0 && (
          <div className="mt-3" aria-hidden="true">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    index < strength ? "bg-primary" : "bg-background-container"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1.5 text-xs text-on-background/65">
              {strength < 3
                ? "Add uppercase letters, numbers and symbols for a stronger password."
                : "Strong password."}
            </p>
          </div>
        )}
      </div>

      {isSignup && (
        <>
          <div>
            <label htmlFor="auth-confirm" className={labelClass}>
              Confirm password
            </label>
            <input
              id="auth-confirm"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword ? "auth-confirm-error" : undefined
              }
              className={fieldClass}
            />
            {fieldErrors.confirmPassword && (
              <p id="auth-confirm-error" className={errorTextClass}>
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-on-background/80">
              <input
                type="checkbox"
                checked={terms}
                onChange={(event) => setTerms(event.target.checked)}
                aria-invalid={Boolean(fieldErrors.terms)}
                className="mt-0.5 size-4 shrink-0 rounded border-background-container accent-primary"
              />
              <span>
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>
            {fieldErrors.terms && (
              <p className={errorTextClass}>{fieldErrors.terms}</p>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="landing-solid-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isSignup ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
