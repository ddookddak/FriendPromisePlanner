import { useMemo } from 'react'
import { DayCell } from './DayCell'
import { ScheduleMap } from './CalendarView'
import { getDateRange, formatDate } from '@/lib/utils'

interface Props {
  startDate: string
  endDate: string
  schedules: ScheduleMap
  totalMembers: number
  selectedDate: string | null
  onSelectDate: (date: string) => void
  onToggle: (date: string) => void
  toggling: string | null
  roomStatus?: string
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function CalendarGrid({
  startDate,
  endDate,
  schedules,
  totalMembers,
  selectedDate,
  onSelectDate,
  onToggle,
  toggling,
  roomStatus,
}: Props) {
  const dates = useMemo(
    () => getDateRange(new Date(startDate), new Date(endDate)),
    [startDate, endDate]
  )

  const months = useMemo(() => {
    const map = new Map<string, Date[]>()
    for (const date of dates) {
      const key = `${date.getFullYear()}-${date.getMonth()}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(date)
    }
    return Array.from(map.entries())
  }, [dates])

  return (
    <div className="space-y-8">
      {months.map(([key, monthDates]) => {
        const first = monthDates[0]
        const year = first.getFullYear()
        const month = first.getMonth()
        const monthLabel = `${year}년 ${month + 1}월`
        const startDayOfWeek = monthDates[0].getDay()

        return (
          <div key={key}>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{monthLabel}</h2>
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d, i) => (
                <div
                  key={d}
                  className={`text-center text-xs font-medium py-1 ${
                    i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {d}
                </div>
              ))}

              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {monthDates.map((date) => {
                const dateStr = formatDate(date)
                const isDisabled = roomStatus === 'CONFIRMED' || roomStatus === 'CLOSED'
                return (
                  <DayCell
                    key={dateStr}
                    date={date}
                    dayData={schedules[dateStr]}
                    totalMembers={totalMembers}
                    isSelected={selectedDate === dateStr}
                    isToggling={toggling === dateStr}
                    isDisabled={isDisabled}
                    onSelect={() => onSelectDate(dateStr)}
                    onToggle={() => !isDisabled && onToggle(dateStr)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
