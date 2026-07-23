import { useCallback, useEffect, useState } from 'react'
import type { LocationInfo, WeatherData } from './types'
import { DEFAULT_LOCATION } from './data/districts'
import { fetchWeatherData } from './api/weather'
import { getSummary } from './utils/recommendations'
import { Header } from './components/Header'
import { SummaryCard } from './components/SummaryCard'
import { KeyMetrics } from './components/KeyMetrics'
import { ActivityRecommendations } from './components/ActivityRecommendations'
import { HourlyForecast } from './components/HourlyForecast'
import { LocationSearch } from './components/LocationSearch'
import { ErrorState } from './components/ErrorState'
import {
  ActivityListSkeleton,
  HourlyForecastSkeleton,
  KeyMetricsSkeleton,
  SummaryCardSkeleton,
} from './components/Skeletons'

const STORAGE_KEY = 'weather-app:last-location'

function loadStoredLocation(): LocationInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_LOCATION
    const parsed = JSON.parse(raw)
    if (
      typeof parsed?.name === 'string' &&
      typeof parsed?.lat === 'number' &&
      typeof parsed?.lon === 'number'
    ) {
      return parsed
    }
  } catch {
    // ข้ามหากข้อมูลใน localStorage เสียหาย ใช้ค่าเริ่มต้นแทน
  }
  return DEFAULT_LOCATION
}

function App() {
  const [location, setLocation] = useState<LocationInfo>(loadStoredLocation)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const loadWeather = useCallback(
    async (loc: LocationInfo, mode: 'initial' | 'refresh') => {
      if (mode === 'initial') setIsLoading(true)
      else setIsRefreshing(true)
      setError(null)
      try {
        const data = await fetchWeatherData(loc)
        setWeather(data)
      } catch {
        setError('ไม่สามารถโหลดข้อมูลสภาพอากาศได้ กรุณาลองใหม่อีกครั้ง')
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [],
  )

  useEffect(() => {
    loadWeather(location, 'initial')
  }, [location, loadWeather])

  const handleRefresh = () => {
    if (isLoading || isRefreshing) return
    loadWeather(location, 'refresh')
  }

  const handleSelectLocation = (loc: LocationInfo) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
    setLocation(loc)
  }

  const showSkeleton = isLoading && !weather

  return (
    <div className="min-h-screen">
      <Header
        locationName={location.name}
        updatedAt={weather?.updatedAt ?? null}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
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
              <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm text-rose-300">
                {error}
              </p>
            )}
            <SummaryCard
              weatherCode={weather.weatherCode}
              summary={getSummary(weather)}
            />
            <KeyMetrics data={weather} />
            <ActivityRecommendations data={weather} />
            <HourlyForecast hourly={weather.hourly} />
          </>
        )}
      </main>

      <LocationSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectLocation}
      />
    </div>
  )
}

export default App
