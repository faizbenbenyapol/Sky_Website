import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  unit?: string
  valueColor: string
  badgeBg: string
  subLabel: string
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  valueColor,
  badgeBg,
  subLabel,
}: MetricCardProps) {
  return (
    <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-text-muted)]/40 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${badgeBg} ${valueColor}`}
        >
          <Icon size={16} />
        </div>
        <span className="text-sm text-[var(--color-text-soft)]">{label}</span>
      </div>
      <div className="mt-3.5 flex items-baseline gap-1">
        <span className={`text-3xl font-semibold tabular-nums ${valueColor}`}>
          {value}
        </span>
        {unit && (
          <span className="text-base text-[var(--color-text-muted)]">
            {unit}
          </span>
        )}
      </div>
      <p className="mt-1.5 truncate text-xs text-[var(--color-text-muted)]">
        {subLabel}
      </p>
    </div>
  )
}
