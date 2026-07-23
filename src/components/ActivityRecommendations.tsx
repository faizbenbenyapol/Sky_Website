import type { WeatherData } from '../types'
import { getActivityRecommendations } from '../utils/recommendations'
import { SEVERITY_STYLES } from '../utils/severity'

interface ActivityRecommendationsProps {
  data: WeatherData
}

export function ActivityRecommendations({
  data,
}: ActivityRecommendationsProps) {
  const items = getActivityRecommendations(data)

  return (
    <section>
      <h3 className="mb-3 text-sm font-medium text-[var(--color-text-soft)]">
        คำแนะนำกิจกรรมประจำวัน
      </h3>
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        {items.map((item, index) => {
          const style = SEVERITY_STYLES[item.severity]
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03] ${
                index !== items.length - 1
                  ? 'border-b border-[var(--color-border)]'
                  : ''
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg}`}
              >
                <Icon size={18} className={style.text} />
              </div>
              <p className="flex-1 text-sm text-[var(--color-text)] sm:text-base">
                {item.question}
              </p>
              <span
                className={`shrink-0 rounded-full ${style.bg} px-3 py-1 text-xs font-medium ${style.text} sm:text-sm`}
              >
                {item.answer}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
