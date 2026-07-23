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
}

export interface WeatherData {
  updatedAt: string // ISO datetime
  temperature: number
  feelsLike: number
  humidity: number
  weatherCode: number
  rainChance: number
  rainPeakLabel: string
  pm25: number
  hourly: HourlyPoint[]
}

export type SeverityLevel = 'good' | 'warn' | 'bad'
