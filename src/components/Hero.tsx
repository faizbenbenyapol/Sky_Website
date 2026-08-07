import { ChevronDown, MapPin, RefreshCw } from 'lucide-react'
import type { WeatherData } from '../types'
import { formatMastheadDate, formatUpdatedTime } from '../utils/format'
import { getWeatherInfo } from '../utils/weatherCode'
import { getSkyGradient, getWeatherAccent, getWeatherCategory } from '../utils/theme'
import { WeatherScene } from './WeatherScene'

interface HeroProps {
  locationName: string
  weather: WeatherData | null
  updatedAt: string | null
  isRefreshing: boolean
  onRefresh: () => void
  onOpenSearch: () => void
}

export function Hero({
  locationName,
  weather,
  updatedAt,
  isRefreshing,
  onRefresh,
  onOpenSearch,
}: HeroProps) {
  const category = weather ? getWeatherCategory(weather.weatherCode) : null
  const isDay = weather?.isDay ?? true
  const skyGradient = category
    ? getSkyGradient(category, isDay)
    : 'from-[var(--color-surface)] via-[var(--color-bg)] to-[var(--color-bg)]'
  const accent = category ? getWeatherAccent(category, isDay) : 'text-[var(--color-text-muted)]'
  const info = weather ? getWeatherInfo(weather.weatherCode, weather.isDay) : null
  const Icon = info?.icon

  return (
    <div
      className={`relative overflow-hidden border-b border-[var(--color-border)] bg-gradient-to-b ${skyGradient} px-4 pb-7 pt-[max(env(safe-area-inset-top),1rem)] sm:border sm:px-6 sm:pt-6`}
    >
      {category && <WeatherScene category={category} isDay={isDay} />}

      <p className="relative mb-3 border-b-4 border-double border-[var(--color-border)] pb-2 text-center text-[11px] font-medium tracking-[0.2em] text-[var(--color-text-muted)]">
        {formatMastheadDate(new Date())}
      </p>

      <div className="relative flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onOpenSearch}
          className="group flex min-w-0 items-center gap-1.5 text-[var(--color-text)] transition-opacity active:opacity-60"
        >
          <MapPin size={15} className="shrink-0 text-[var(--color-text-muted)]" />
          <span className="truncate text-sm font-medium">{locationName}</span>
          <ChevronDown
            size={14}
            className="shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-y-0.5"
          />
        </button>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="รีเฟรชข้อมูล"
          className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--color-text-soft)] transition-colors hover:text-[var(--color-text)] active:opacity-60 disabled:opacity-40"
        >
          <RefreshCw size={17} className={isRefreshing ? 'animate-spin-slow' : ''} />
        </button>
      </div>

      <p className="relative mt-2 text-center text-xs text-[var(--color-text-muted)]">
        {updatedAt ? formatUpdatedTime(updatedAt) : 'กำลังโหลดข้อมูล...'}
      </p>

      <div className="relative mt-3 flex flex-col items-center">
        {weather && Icon ? (
          <Icon size={72} strokeWidth={1.25} className={accent} />
        ) : (
          <div className="skeleton h-[72px] w-[72px] rounded-full" />
        )}

        {weather ? (
          <>
            <div className="mt-1 flex items-start leading-none font-[family-name:var(--font-display)]">
              <span className="text-[5rem] font-medium tabular-nums tracking-tight text-[var(--color-text)] sm:text-8xl">
                {weather.temperature}
              </span>
              <span className="mt-2 text-4xl text-[var(--color-text-muted)]">°</span>
            </div>
            <p className="mt-1 text-base font-medium text-[var(--color-text-soft)]">
              {info?.label}
            </p>
            <div className="mt-3 flex items-center gap-2.5 text-sm text-[var(--color-text-muted)]">
              <span>รู้สึกได้ {weather.feelsLike}°</span>
              <span className="h-1 w-1 rounded-full bg-current opacity-40" />
              <span>
                สูงสุด {weather.tempMax}° · ต่ำสุด {weather.tempMin}°
              </span>
            </div>
          </>
        ) : (
          <div className="mt-3 flex flex-col items-center gap-3">
            <div className="skeleton h-16 w-40" />
            <div className="skeleton h-4 w-28" />
          </div>
        )}
      </div>
    </div>
  )
}
