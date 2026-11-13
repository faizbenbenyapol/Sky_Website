import type { HourlyPoint, LocationInfo, Pm25Reading, WeatherData } from '../types'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
// เรียกผ่าน proxy ของเว็บเราเอง (vite.config.ts ตอน dev, nginx.conf บนเซิร์ฟเวอร์) เพราะ Air4Thai ไม่ส่ง CORS header
const AIR4THAI_URL = '/api/air4thai/getNewAQI_JSON.php'
// เขตในกรุงเทพฯ ห่างสถานีที่ใกล้สุดไม่เกิน 5.2 กม. เกินนี้ค่าสถานีไม่ได้แม่นกว่าแบบจำลองแล้ว
const MAX_STATION_DISTANCE_KM = 10
// สถานีที่เสียมักค้างค่าเก่าไว้หลายสัปดาห์ ข้อมูลปกติอัปเดตทุกชั่วโมง
const MAX_READING_AGE_HOURS = 3
const EARTH_RADIUS_KM = 6371

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

// เฉพาะฟิลด์ที่ใช้ของ Air4Thai ตัวเลขทุกตัวมาเป็น string
interface Air4ThaiResponse {
  stations: {
    lat: string
    long: string
    AQILast: {
      date: string // 'YYYY-MM-DD' เวลาไทย
      time: string // 'HH:MM'
      PM25: { value: string } // '-1' เมื่อเครื่องวัดเสีย
    }
  }[]
}

/**
 * ระยะทางตามผิวโลกระหว่างสองพิกัด (สูตร haversine)
 * @returns ระยะทางเป็นกิโลเมตร
 */
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2 - lon1) / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

/**
 * ค่า PM2.5 จากสถานีของกรมควบคุมมลพิษที่ใกล้ตำแหน่งนี้ที่สุด
 * ข้ามสถานีที่ค่าเสีย (ติดลบ/ไม่ใช่ตัวเลข) หรือข้อมูลเก่ากว่า MAX_READING_AGE_HOURS
 * @returns ค่า µg/m³ ปัดเป็นจำนวนเต็ม หรือ null ถ้าไม่มีสถานีที่ใช้ได้ภายใน MAX_STATION_DISTANCE_KM
 * ผลข้างเคียง: ส่ง request ไปที่ proxy หนึ่งครั้ง (ได้ข้อมูลทุกสถานีทั่วประเทศ ~140 KB)
 */
async function fetchStationPm25(location: LocationInfo): Promise<Pm25Reading | null> {
  let data: Air4ThaiResponse
  try {
    const res = await fetch(AIR4THAI_URL)
    if (!res.ok) return null
    data = await res.json()
  } catch {
    // Air4Thai ล่มหรือ proxy ใช้ไม่ได้ ยอมรับได้เพราะ fetchPm25 จะไปใช้ค่าจากแบบจำลองแทน
    return null
  }

  const oldestMs = Date.now() - MAX_READING_AGE_HOURS * 60 * 60 * 1000
  let nearest: { km: number; value: number } | null = null
  for (const station of data.stations) {
    const { date, time, PM25 } = station.AQILast
    const value = Number(PM25.value)
    const readAtMs = new Date(`${date}T${time}:00+07:00`).getTime()
    const isValidValue = Number.isFinite(value) && value >= 0
    // วันที่ผิดรูปแบบจะได้ NaN ซึ่งเทียบแล้วเป็น false จึงถูกนับว่าเก่าไปด้วย
    const isFresh = readAtMs >= oldestMs
    if (!isValidValue || !isFresh) continue

    const km = distanceKm(location.lat, location.lon, Number(station.lat), Number(station.long))
    if (nearest === null || km < nearest.km) nearest = { km, value }
  }

  if (nearest === null || nearest.km > MAX_STATION_DISTANCE_KM) return null
  return { value: Math.round(nearest.value), source: 'station' }
}

// ค่าประมาณการจากแบบจำลองบรรยากาศ CAMS ความละเอียด ~40 กม. ใช้เมื่อไม่มีสถานีตรวจวัดจริงใกล้พอ
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
    return { value: Math.round(data.current.pm2_5), source: 'model' }
  } catch {
    return null
  }
}

// ใช้ค่าจากสถานีจริงก่อน ไม่มีค่อยใช้ค่าประมาณจากแบบจำลอง คืน null เมื่อดึงไม่ได้ทั้งสองแหล่ง
async function fetchPm25(location: LocationInfo): Promise<Pm25Reading | null> {
  const station = await fetchStationPm25(location)
  if (station) return station
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
