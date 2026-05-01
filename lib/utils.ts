export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = []
  const current = new Date(start)
  current.setHours(0, 0, 0, 0)
  const endDate = new Date(end)
  endDate.setHours(0, 0, 0, 0)

  while (current <= endDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export function getHeatmapClass(ratio: number): string {
  if (ratio === 0) return 'bg-gray-100 text-gray-400'
  if (ratio <= 0.25) return 'bg-green-100 text-green-700'
  if (ratio <= 0.5) return 'bg-green-300 text-green-800'
  if (ratio <= 0.75) return 'bg-green-500 text-white'
  return 'bg-green-700 text-white'
}
