import type { HourlyPoint, LocationInfo, WeatherData } from '../types'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

interface ForecastResponse {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    weather_code: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    weather_code: number[]
  }
}

interface AirQualityResponse {
  current: {
    pm2_5: number
  }
}

function findRainPeak(
  times: string[],
  probabilities: number[],
  startIndex: number,
  hoursAhead: number,
): { max: number; label: string } {
  let max = 0
  let peakIndex = startIndex
  const end = Math.min(startIndex + hoursAhead, times.length)
  for (let i = startIndex; i < end; i++) {
    if (probabilities[i] > max) {
      max = probabilities[i]
      peakIndex = i
    }
  }
  if (max === 0) {
    return { max: 0, label: 'ไม่มีฝนในช่วงนี้' }
  }
  const peakHour = new Date(times[peakIndex]).getHours()
  const rangeEnd = (peakHour + 2) % 24
  const label = `ช่วง ${String(peakHour).padStart(2, '0')}:00 - ${String(rangeEnd).padStart(2, '0')}:00 น.`
  return { max, label }
}

export async function fetchWeatherData(
  location: LocationInfo,
): Promise<WeatherData> {
  const forecastParams = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    current: 'temperature_2m,apparent_temperature,weather_code,relative_humidity_2m',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    timezone: 'Asia/Bangkok',
    forecast_days: '2',
  })

  const airQualityParams = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    current: 'pm2_5',
    timezone: 'Asia/Bangkok',
  })

  const [forecastRes, airQualityRes] = await Promise.all([
    fetch(`${FORECAST_URL}?${forecastParams.toString()}`),
    fetch(`${AIR_QUALITY_URL}?${airQualityParams.toString()}`),
  ])

  if (!forecastRes.ok || !airQualityRes.ok) {
    throw new Error('ไม่สามารถดึงข้อมูลสภาพอากาศได้')
  }

  const forecast: ForecastResponse = await forecastRes.json()
  const airQuality: AirQualityResponse = await airQualityRes.json()

  const nowIndex = forecast.hourly.time.findIndex(
    (t) => new Date(t).getTime() >= new Date(forecast.current.time).getTime(),
  )
  const startIndex = nowIndex === -1 ? 0 : nowIndex

  const { max: rainChance, label: rainPeakLabel } = findRainPeak(
    forecast.hourly.time,
    forecast.hourly.precipitation_probability,
    startIndex,
    12,
  )

  const hourly: HourlyPoint[] = []
  const step = 3
  for (
    let i = startIndex;
    hourly.length < 6 && i < forecast.hourly.time.length;
    i += step
  ) {
    hourly.push({
      time: forecast.hourly.time[i],
      temperature: Math.round(forecast.hourly.temperature_2m[i]),
      rainChance: forecast.hourly.precipitation_probability[i],
      weatherCode: forecast.hourly.weather_code[i],
    })
  }

  return {
    updatedAt: new Date().toISOString(),
    temperature: Math.round(forecast.current.temperature_2m),
    feelsLike: Math.round(forecast.current.apparent_temperature),
    humidity: forecast.current.relative_humidity_2m,
    weatherCode: forecast.current.weather_code,
    rainChance,
    rainPeakLabel,
    pm25: Math.round(airQuality.current.pm2_5),
    hourly,
  }
}

interface GeocodingResult {
  name: string
  admin1?: string
  latitude: number
  longitude: number
  country: string
}

export async function searchLocationsOnline(
  query: string,
): Promise<LocationInfo[]> {
  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'th',
    format: 'json',
  })
  const res = await fetch(`${GEOCODING_URL}?${params.toString()}`)
  if (!res.ok) return []
  const data: { results?: GeocodingResult[] } = await res.json()
  if (!data.results) return []
  return data.results.map((r) => ({
    name: r.name,
    admin: [r.admin1, r.country].filter(Boolean).join(', '),
    lat: r.latitude,
    lon: r.longitude,
  }))
}
