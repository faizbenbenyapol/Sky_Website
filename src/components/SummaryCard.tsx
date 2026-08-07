import type { SummaryInfo } from '../utils/recommendations'
import { SEVERITY_STYLES } from '../utils/severity'

interface SummaryCardProps {
  summary: SummaryInfo
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const style = SEVERITY_STYLES[summary.severity]

  return (
    <div className="flex border border-[var(--color-border)] bg-[var(--color-surface)]">
      <span className={`w-1 shrink-0 ${style.bar}`} />
      <div className="min-w-0 flex-1 px-4 py-3.5">
        <p className={`text-sm font-semibold sm:text-base ${style.text}`}>
          {summary.headline}
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-text-soft)]">
          {summary.detail}
        </p>
      </div>
    </div>
  )
}
