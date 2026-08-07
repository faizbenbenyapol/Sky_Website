import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  unit?: string
  valueColor: string
  subLabel: string
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  valueColor,
  subLabel,
}: MetricCardProps) {
  return (
    <div className="flex-1 p-5">
      <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
        <Icon size={14} strokeWidth={2} />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span
          className={`font-[family-name:var(--font-display)] text-3xl font-medium tabular-nums ${valueColor}`}
        >
          {value}
        </span>
        {unit && <span className="text-sm text-[var(--color-text-muted)]">{unit}</span>}
      </div>
      <p className="mt-1.5 truncate text-xs text-[var(--color-text-muted)]">{subLabel}</p>
    </div>
  )
}
