'use client'
import { useState } from 'react'

type RoomStatus = 'OPEN' | 'CONFIRMED' | 'CLOSED'

interface Props {
  roomId: string
  initialStatus: RoomStatus
  currentUserName: string
  onStatusChange?: (newStatus: RoomStatus, confirmedDate: string | null) => void
}

const statusOptions: { value: RoomStatus; label: string; color: string }[] = [
  { value: 'OPEN', label: '모집 중', color: 'bg-green-100 text-green-700' },
  { value: 'CONFIRMED', label: '확정', color: 'bg-blue-100 text-blue-700' },
  { value: 'CLOSED', label: '마감', color: 'bg-gray-100 text-gray-500' },
]

export function RoomStatusBadge({ roomId, initialStatus, currentUserName, onStatusChange }: Props) {
  const [status, setStatus] = useState<RoomStatus>(initialStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: RoomStatus) {
    if (newStatus === status) return
    setLoading(true)
    const res = await fetch(`/api/rooms/${roomId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, name: currentUserName }),
    })
    if (res.ok) {
      const data = await res.json()
      setStatus(newStatus)
      onStatusChange?.(newStatus, data.confirmedDate)
    } else {
      const data = await res.json()
      alert(data.error || '상태 변경 실패')
    }
    setLoading(false)
  }

  const current = statusOptions.find((o) => o.value === status)!

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as RoomStatus)}
      disabled={loading}
      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer disabled:opacity-50 ${current.color}`}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
