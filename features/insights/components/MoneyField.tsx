"use client"

import { useId } from "react"

interface MoneyFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  max?: number
  step?: number
  hint?: string
}

export default function MoneyField({
  label,
  value,
  onChange,
  max = 10000,
  step = 50,
  hint,
}: MoneyFieldProps) {
  const id = useId()
  const update = (raw: string) => {
    const parsed = Number(raw)
    onChange(Number.isFinite(parsed) ? Math.max(0, parsed) : 0)
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-on-background">
          {label}
        </label>
        {hint && <span className="text-xs text-on-background/70">{hint}</span>}
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-background-container bg-surface px-3 py-2 transition-colors focus-within:border-primary">
        <span aria-hidden="true" className="text-sm text-on-background/70">$</span>
        <input
          id={id}
          type="number"
          min={0}
          step={step}
          value={value}
          onChange={(event) => update(event.target.value)}
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-on-background outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span aria-hidden="true" className="shrink-0 text-xs text-on-background/70">
          /mo
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(event) => update(event.target.value)}
        aria-label={`${label} slider`}
        className="insight-range mt-3 w-full"
      />
    </div>
  )
}
