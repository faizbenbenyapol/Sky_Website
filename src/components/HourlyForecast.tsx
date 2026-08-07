import { Droplet } from 'lucide-react'
import type { HourlyPoint } from '../types'
import { formatHour } from '../utils/format'
import { getWeatherInfo } from '../utils/weatherCode'

interface HourlyForecastProps {
  hourly: HourlyPoint[]
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <section className="relative">
      <h3 className="mb-3 border-b-4 border-double border-[var(--color-border)] pb-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        พยากรณ์รายช่วงเวลา
      </h3>
      <div className="-mx-4 flex snap-x snap-mandatory divide-x divide-[var(--color-border)] overflow-x-auto border border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0">
        {hourly.map((point, index) => {
          const { icon: Icon } = getWeatherInfo(point.weatherCode, point.isDay)
          const isNow = index === 0
          return (
            <div
              key={point.time}
              className={`flex w-[96px] shrink-0 snap-start flex-col items-center gap-2.5 py-5 sm:w-auto ${
                isNow ? 'bg-[var(--color-accent-soft)]' : ''
              }`}
            >
              <span
                className={`text-xs font-medium ${isNow ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}
              >
                {isNow ? 'ตอนนี้' : formatHour(point.time)}
              </span>
              <Icon
                size={30}
                strokeWidth={1.5}
                className={isNow ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-soft)]'}
              />
              <span className="text-xl font-semibold tabular-nums text-[var(--color-text)]">
                {point.temperature}°
              </span>
              <span className="flex items-center gap-1 text-xs tabular-nums text-[var(--color-text-muted)]">
                <Droplet size={11} className="text-[#2f5163]" />
                {point.rainChance}%
              </span>
            </div>
          )
        })}
      </div>
      <div className="pointer-events-none absolute bottom-1 right-0 top-9 w-8 bg-gradient-to-l from-[var(--color-bg)] to-transparent sm:hidden" />
    </section>
  )
}
