import type { HourlyPoint } from '../types'
import { formatHour } from '../utils/format'
import { getWeatherInfo } from '../utils/weatherCode'

interface HourlyForecastProps {
  hourly: HourlyPoint[]
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-medium text-[var(--color-text-soft)]">
        พยากรณ์รายช่วงเวลา
      </h3>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-3 sm:px-0">
        {hourly.map((point, index) => {
          const { icon: Icon } = getWeatherInfo(point.weatherCode)
          const isNow = index === 0
          return (
            <div
              key={point.time}
              className={`flex w-[92px] shrink-0 snap-start flex-col items-center gap-2 rounded-xl border py-4 shadow-[var(--shadow-card)] transition-colors sm:w-auto ${
                isNow
                  ? 'border-sky-400/30 bg-sky-400/[0.08]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)]'
              }`}
            >
              <span
                className={`text-xs ${isNow ? 'font-medium text-sky-400' : 'text-[var(--color-text-muted)]'}`}
              >
                {isNow ? 'ตอนนี้' : formatHour(point.time)}
              </span>
              <Icon size={26} strokeWidth={1.5} className="text-sky-400" />
              <span className="text-base font-semibold tabular-nums text-[var(--color-text)]">
                {point.temperature}°
              </span>
              <span className="text-xs tabular-nums text-[var(--color-text-muted)]">
                {point.rainChance}%
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
