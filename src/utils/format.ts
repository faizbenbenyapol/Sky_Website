export function formatUpdatedTime(iso: string): string {
  const date = new Date(iso)
  return `อัปเดตล่าสุด ${date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })} น.`
}

export function formatHour(iso: string): string {
  const date = new Date(iso)
  return `${String(date.getHours()).padStart(2, '0')}:00`
}
