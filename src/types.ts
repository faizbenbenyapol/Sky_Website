export interface LocationInfo {
  name: string
  admin?: string
  lat: number
  lon: number
}

export interface HourlyPoint {
  time: string // ISO datetime
  temperature: number
  rainChance: number
  weatherCode: number
  isDay: boolean
}

// ค่าฝุ่น PM2.5 หน่วย µg/m³ เสมอ
// 'station' = สถานีตรวจวัดจริงของกรมควบคุมมลพิษ (Air4Thai), 'model' = ค่าประมาณจากแบบจำลอง CAMS (ความละเอียด ~40 กม.)
export interface Pm25Reading {
  value: number
  source: 'station' | 'model'
}

export interface WeatherData {
  updatedAt: string // ISO datetime
  temperature: number
  feelsLike: number
  tempMax: number
  tempMin: number
  weatherCode: number
  isDay: boolean
  rainChance: number
  rainPeakLabel: string
  pm25: Pm25Reading | null
  hourly: HourlyPoint[]
}

export type SeverityLevel = 'good' | 'warn' | 'bad' | 'unknown'
