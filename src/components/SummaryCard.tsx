import type { SummaryInfo } from '../utils/recommendations'
import { getWeatherInfo } from '../utils/weatherCode'
import { SEVERITY_STYLES } from '../utils/severity'

interface SummaryCardProps {
  weatherCode: number
  summary: SummaryInfo
}

const SEVERITY_TAG: Record<SummaryInfo['severity'], string> = {
  good: 'สภาพอากาศดี',
  warn: 'ควรระวัง',
  bad: 'ควรระวังเป็นพิเศษ',
}

export function SummaryCard({ weatherCode, summary }: SummaryCardProps) {
  const { icon: Icon } = getWeatherInfo(weatherCode)
  const style = SEVERITY_STYLES[summary.severity]

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-6 shadow-[var(--shadow-card)] sm:p-8`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full ${style.bg} blur-2xl`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full ${style.bg} px-2.5 py-1 text-xs font-medium ${style.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {SEVERITY_TAG[summary.severity]}
          </span>
          <h2 className="mt-3 text-xl font-semibold leading-snug text-[var(--color-text)] sm:text-2xl">
            {summary.headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-base">
            {summary.detail}
          </p>
        </div>
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${style.bg} ring-1 ring-inset ${style.border} sm:h-24 sm:w-24`}
        >
          <Icon
            size={32}
            strokeWidth={1.5}
            className={`${style.text} sm:h-12 sm:w-12`}
          />
        </div>
      </div>
    </div>
  )
}
