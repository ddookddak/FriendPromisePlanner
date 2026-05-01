'use client'
import { useState, useEffect, useCallback } from 'react'
import { CalendarGrid } from './CalendarGrid'
import { ParticipantPanel } from './ParticipantPanel'

interface Props {
  roomId: string
  startDate: string
  endDate: string
  totalMembers: number
  currentUserName: string
  roomStatus?: string
}

export interface DayData {
  participants: { id: string; name: string }[]
  isMySchedule: boolean
}

export type ScheduleMap = Record<string, DayData>

export function CalendarView({ roomId, startDate, endDate, totalMembers, currentUserName, roomStatus }: Props) {
  const [schedules, setSchedules] = useState<ScheduleMap>({})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  const fetchSchedules = useCallback(async () => {
    const res = await fetch(`/api/rooms/${roomId}/schedules`)
    const data = await res.json()

    const map: ScheduleMap = {}
    for (const [date, info] of Object.entries(data as Record<string, { participants: { id: string; name: string }[] }>)) {
      map[date] = {
        participants: info.participants,
        isMySchedule: info.participants.some((p) => p.name === currentUserName),
      }
    }
    setSchedules(map)
    setLoading(false)
  }, [roomId, currentUserName])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  async function handleToggle(date: string) {
    setToggling(date)
    await fetch(`/api/rooms/${roomId}/schedules`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, participantName: currentUserName }),
    })
    await fetchSchedules()
    setToggling(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">일정을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 flex-col lg:flex-row">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          <span>참여 인원:</span>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded bg-gray-100" />
            <span>0명</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded bg-green-100" />
            <span>적음</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded bg-green-400" />
            <span>보통</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded bg-green-700" />
            <span>많음</span>
          </div>
        </div>

        <CalendarGrid
          startDate={startDate}
          endDate={endDate}
          schedules={schedules}
          totalMembers={totalMembers}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onToggle={handleToggle}
          toggling={toggling}
          roomStatus={roomStatus}
        />
      </div>

      {selectedDate && (
        <div className="lg:w-72">
          <ParticipantPanel
            date={selectedDate}
            dayData={schedules[selectedDate]}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      )}
    </div>
  )
}
