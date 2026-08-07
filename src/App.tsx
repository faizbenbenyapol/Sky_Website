import { useCallback, useEffect, useRef, useState } from 'react'
import { LocateFixed, X } from 'lucide-react'
import type { LocationInfo, WeatherData } from './types'
import { DEFAULT_LOCATION } from './data/districts'
import { fetchWeatherData } from './api/weather'
import { getSummary } from './utils/recommendations'
import { getCurrentLocation } from './utils/geolocation'
import { Hero } from './components/Hero'
import { SummaryCard } from './components/SummaryCard'
import { KeyMetrics } from './components/KeyMetrics'
import { ActivityRecommendations } from './components/ActivityRecommendations'
import { HourlyForecast } from './components/HourlyForecast'
import { LocationSearch } from './components/LocationSearch'
import { ErrorState } from './components/ErrorState'
import { PullToRefresh } from './components/PullToRefresh'
import {
  ActivityListSkeleton,
  HourlyForecastSkeleton,
  KeyMetricsSkeleton,
  SummaryCardSkeleton,
} from './components/Skeletons'

const AUTO_REFRESH_MS = 10 * 60 * 1000

function App() {
  const [location, setLocation] = useState<LocationInfo>(DEFAULT_LOCATION)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)

  // ป้องกันข้อมูลเก่าทับข้อมูลใหม่เมื่อผู้ใช้สลับพื้นที่เร็ว ๆ ก่อนคำขอก่อนหน้าจะเสร็จ
  const requestIdRef = useRef(0)

  const loadWeather = useCallback(
    async (loc: LocationInfo, mode: 'initial' | 'refresh') => {
      const requestId = ++requestIdRef.current
      if (mode === 'initial') setIsLoading(true)
      else setIsRefreshing(true)
      setError(null)
      try {
        const data = await fetchWeatherData(loc)
        if (requestIdRef.current !== requestId) return
        setWeather(data)
      } catch {
        if (requestIdRef.current !== requestId) return
        setError('ไม่สามารถโหลดข้อมูลสภาพอากาศได้ กรุณาลองใหม่อีกครั้ง')
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      }
    },
    [],
  )

  useEffect(() => {
    setWeather(null)
    loadWeather(location, 'initial')
  }, [location, loadWeather])

  // เช็คตำแหน่งปัจจุบันเงียบ ๆ ทุกครั้งที่เปิดเว็บ (ถ้าเคยอนุญาตแล้ว) ถ้ายังไม่เคยถามให้โชว์คำอธิบายก่อนเบราว์เซอร์เด้งขอสิทธิ์
  useEffect(() => {
    let cancelled = false

    const applyDetectedLocation = async () => {
      const detected = await getCurrentLocation({ timeout: 8000 })
      if (!cancelled && detected) setLocation(detected)
    }

    const permissionsApi = navigator.permissions
    if (!permissionsApi?.query) {
      applyDetectedLocation()
      return
    }

    permissionsApi
      .query({ name: 'geolocation' })
      .then((status) => {
        if (cancelled) return
        if (status.state === 'granted') {
          applyDetectedLocation()
        } else if (status.state === 'prompt') {
          setShowLocationPrompt(true)
        }
      })
      .catch(() => {
        if (!cancelled) applyDetectedLocation()
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleAllowLocation = () => {
    setShowLocationPrompt(false)
    getCurrentLocation({ timeout: 8000 }).then((detected) => {
      if (detected) setLocation(detected)
    })
  }

  useEffect(() => {
    document.title = `สภาพอากาศเขต${location.name}`
  }, [location])

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadWeather(location, 'refresh')
      }
    }, AUTO_REFRESH_MS)
    return () => clearInterval(interval)
  }, [location, loadWeather])

  const handleRefresh = () => {
    if (isLoading || isRefreshing) return
    loadWeather(location, 'refresh')
  }

  const handleSelectLocation = (loc: LocationInfo) => {
    setLocation(loc)
  }

  const showSkeleton = isLoading && !weather

  return (
    <div className="min-h-screen pb-10">
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="mx-auto max-w-4xl sm:px-6 sm:pt-6">
          <Hero
            locationName={location.name}
            weather={weather}
            updatedAt={weather?.updatedAt ?? null}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </div>

        <main className="mx-auto max-w-4xl space-y-5 px-4 pb-6 pt-5 sm:px-6">
          {showLocationPrompt && (
            <div className="flex items-center gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
              <LocateFixed size={18} className="shrink-0 text-[var(--color-accent)]" />
              <p className="flex-1 text-sm text-[var(--color-text-soft)]">
                ใช้ตำแหน่งปัจจุบันเพื่อพยากรณ์ที่แม่นยำขึ้นได้ไหม
              </p>
              <button
                type="button"
                onClick={handleAllowLocation}
                className="shrink-0 text-sm font-semibold text-[var(--color-accent)]"
              >
                อนุญาต
              </button>
              <button
                type="button"
                onClick={() => setShowLocationPrompt(false)}
                aria-label="ปิด"
                className="shrink-0 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {error && !weather && (
            <ErrorState message={error} onRetry={handleRefresh} />
          )}

          {!error && showSkeleton && (
            <>
              <SummaryCardSkeleton />
              <KeyMetricsSkeleton />
              <ActivityListSkeleton />
              <HourlyForecastSkeleton />
            </>
          )}

          {weather && (
            <>
              {error && (
                <p className="border border-[var(--color-bad)]/30 bg-[var(--color-bad-soft)] px-4 py-2 text-sm text-[var(--color-bad)]">
                  {error}
                </p>
              )}
              <div className="animate-rise-in" style={{ animationDelay: '0ms' }}>
                <SummaryCard summary={getSummary(weather)} />
              </div>
              <div className="animate-rise-in" style={{ animationDelay: '60ms' }}>
                <KeyMetrics data={weather} />
              </div>
              <div className="animate-rise-in" style={{ animationDelay: '120ms' }}>
                <ActivityRecommendations data={weather} />
              </div>
              <div className="animate-rise-in" style={{ animationDelay: '180ms' }}>
                <HourlyForecast hourly={weather.hourly} />
              </div>
            </>
          )}
        </main>
      </PullToRefresh>

      <LocationSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectLocation}
      />
    </div>
  )
}

export default App
