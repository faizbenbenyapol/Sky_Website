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
      <h3 className="mb-3 border-b-4 border-double border-[var(--color-border)] pb-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        คำแนะนำกิจกรรมประจำวัน
      </h3>
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)]">
        {items.map((item, index) => {
          const style = SEVERITY_STYLES[item.severity]
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                index !== items.length - 1
                  ? 'border-b border-[var(--color-border)]'
                  : ''
              }`}
            >
              <Icon size={18} className={style.text} />
              <p className="flex-1 text-sm text-[var(--color-text)] sm:text-base">
                {item.question}
              </p>
              <span className={`shrink-0 text-sm font-semibold sm:text-base ${style.text}`}>
                {item.answer}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
