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

// 'aqi' = ดัชนีคุณภาพอากาศจากสถานีตรวจวัดจริง (แม่นยำที่สุด), 'ugm3' = ค่าประมาณจากแบบจำลองบรรยากาศ (ความละเอียด ~40 กม.)
export interface Pm25Reading {
  value: number
  unit: 'aqi' | 'ugm3'
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
