import { CloudRain, Thermometer, Wind } from 'lucide-react'
import type { WeatherData } from '../types'
import { getPM25Info } from '../utils/recommendations'
import { MetricCard } from './MetricCard'

interface KeyMetricsProps {
  data: WeatherData
}

export function KeyMetrics({ data }: KeyMetricsProps) {
  const pm25Info = getPM25Info(data.pm25)

  const rainColor =
    data.rainChance >= 60
      ? 'text-rose-400'
      : data.rainChance >= 30
        ? 'text-amber-400'
        : 'text-sky-400'
  const rainBadgeBg =
    data.rainChance >= 60
      ? 'bg-rose-400/10'
      : data.rainChance >= 30
        ? 'bg-amber-400/10'
        : 'bg-sky-400/10'

  const pm25Color =
    pm25Info.severity === 'bad'
      ? 'text-rose-400'
      : pm25Info.severity === 'warn'
        ? 'text-amber-400'
        : 'text-emerald-400'
  const pm25BadgeBg =
    pm25Info.severity === 'bad'
      ? 'bg-rose-400/10'
      : pm25Info.severity === 'warn'
        ? 'bg-amber-400/10'
        : 'bg-emerald-400/10'

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        icon={CloudRain}
        label="โอกาสฝน"
        value={String(data.rainChance)}
        unit="%"
        valueColor={rainColor}
        badgeBg={rainBadgeBg}
        subLabel={data.rainPeakLabel}
      />
      <MetricCard
        icon={Thermometer}
        label="อุณหภูมิ"
        value={String(data.temperature)}
        unit="°C"
        valueColor="text-white"
        badgeBg="bg-white/10"
        subLabel={`รู้สึกได้ ${data.feelsLike}°C`}
      />
      <MetricCard
        icon={Wind}
        label="PM2.5"
        value={String(data.pm25)}
        unit="µg/m³"
        valueColor={pm25Color}
        badgeBg={pm25BadgeBg}
        subLabel={`ระดับ${pm25Info.level}`}
      />
    </div>
  )
}
