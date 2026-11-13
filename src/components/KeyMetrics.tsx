import { CloudRain, Gauge } from 'lucide-react'
import type { SeverityLevel, WeatherData } from '../types'
import { getPM25Info } from '../utils/recommendations'
import { SEVERITY_STYLES } from '../utils/severity'
import { MetricCard } from './MetricCard'

interface KeyMetricsProps {
  data: WeatherData
}

function getRainSeverity(rainChance: number): SeverityLevel {
  if (rainChance >= 60) return 'bad'
  if (rainChance >= 30) return 'warn'
  return 'good'
}

export function KeyMetrics({ data }: KeyMetricsProps) {
  const pm25Info = getPM25Info(data.pm25)
  const rainStyle = SEVERITY_STYLES[getRainSeverity(data.rainChance)]
  const pm25Style = SEVERITY_STYLES[pm25Info.severity]

  return (
    <div className="flex divide-x divide-[var(--color-border)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <MetricCard
        icon={CloudRain}
        label="โอกาสฝน"
        value={String(data.rainChance)}
        unit="%"
        valueColor={rainStyle.text}
        subLabel={data.rainPeakLabel}
      />
      <MetricCard
        icon={Gauge}
        label="PM2.5"
        value={data.pm25 === null ? '–' : String(data.pm25.value)}
        unit={data.pm25 === null ? undefined : 'µg/m³'}
        valueColor={pm25Style.text}
        subLabel={
          data.pm25 === null
            ? 'ไม่พบข้อมูลฝุ่น'
            : data.pm25.source === 'station'
              ? `ระดับ${pm25Info.level} · จากสถานีจริง`
              : `ระดับ${pm25Info.level} · ประมาณการ`
        }
      />
    </div>
  )
}
