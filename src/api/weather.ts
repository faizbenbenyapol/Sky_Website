import type { HourlyPoint, LocationInfo, Pm25Reading, WeatherData } from '../types'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WAQI_URL = 'https://api.waqi.info/feed'

interface ForecastResponse {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
    is_day: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    weather_code: number[]
    is_day: number[]
  }
  daily: {
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

interface AirQualityResponse {
  current: {
    pm2_5: number
  }
}

interface WaqiResponse {
  status: string
  data?: {
    aqi: number | string
  }
}

// สถานีตรวจวัดจริงของกรมควบคุมมลพิษ (ผ่าน WAQI) แม่นยำกว่าแบบจำลองบรรยากาศมาก
// ต้องตั้งค่า VITE_WAQI_TOKEN (ขอฟรีได้ที่ aqicn.org/data-platform/token) ไม่งั้นจะข้ามไปใช้ค่าประมาณการแทน
async function fetchGroundPm25(location: LocationInfo): Promise<Pm25Reading | null> {
  const token = import.meta.env.VITE_WAQI_TOKEN
  if (!token) return null
  try {
    const res = await fetch(
      `${WAQI_URL}/geo:${location.lat};${location.lon}/?token=${token}`,
    )
    if (!res.ok) return null
    const data: WaqiResponse = await res.json()
    const aqi = data.data?.aqi
    if (data.status !== 'ok' || typeof aqi !== 'number' || !Number.isFinite(aqi)) {
      return null
    }
    return { value: Math.round(aqi), unit: 'aqi' }
  } catch {
    return null
  }
}

// ค่าประมาณการจากแบบจำลองบรรยากาศ CAMS ความละเอียด ~40 กม. ใช้เมื่อไม่มีสถานีตรวจวัดจริง
async function fetchModelPm25(location: LocationInfo): Promise<Pm25Reading | null> {
  const airQualityParams = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    current: 'pm2_5',
    timezone: 'Asia/Bangkok',
  })
  try {
    const res = await fetch(`${AIR_QUALITY_URL}?${airQualityParams.toString()}`)
    if (!res.ok) return null
    const data: AirQualityResponse = await res.json()
    return { value: Math.round(data.current.pm2_5), unit: 'ugm3' }
  } catch {
    return null
  }
}

async function fetchPm25(location: LocationInfo): Promise<Pm25Reading | null> {
  const ground = await fetchGroundPm25(location)
  if (ground) return ground
  return fetchModelPm25(location)
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
    current: 'temperature_2m,apparent_temperature,weather_code,is_day',
    hourly: 'temperature_2m,precipitation_probability,weather_code,is_day',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'Asia/Bangkok',
    forecast_days: '2',
  })

  const [forecastRes, pm25] = await Promise.all([
    fetch(`${FORECAST_URL}?${forecastParams.toString()}`),
    fetchPm25(location),
  ])

  if (!forecastRes.ok) {
    throw new Error('ไม่สามารถดึงข้อมูลสภาพอากาศได้')
  }

  const forecast: ForecastResponse = await forecastRes.json()

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
      isDay: forecast.hourly.is_day[i] === 1,
    })
  }

  return {
    updatedAt: new Date().toISOString(),
    temperature: Math.round(forecast.current.temperature_2m),
    feelsLike: Math.round(forecast.current.apparent_temperature),
    tempMax: Math.round(forecast.daily.temperature_2m_max[0]),
    tempMin: Math.round(forecast.daily.temperature_2m_min[0]),
    weatherCode: forecast.current.weather_code,
    isDay: forecast.current.is_day === 1,
    rainChance,
    rainPeakLabel,
    pm25,
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
