'use client'
import { useState } from 'react'

type RoomStatus = 'OPEN' | 'CONFIRMED' | 'CLOSED'

interface Props {
  roomId: string
  currentStatus: RoomStatus
}

const statusOptions: { value: RoomStatus; label: string }[] = [
  { value: 'OPEN', label: '모집 중' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'CLOSED', label: '마감' },
]

export function RoomStatusSelect({ roomId, currentStatus }: Props) {
  const [status, setStatus] = useState<RoomStatus>(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: RoomStatus) {
    if (newStatus === status) return
    setLoading(true)
    const res = await fetch(`/api/rooms/${roomId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setStatus(newStatus)
    } else {
      const data = await res.json()
      alert(data.error || '상태 변경 실패')
    }
    setLoading(false)
  }

  const colorMap: Record<RoomStatus, string> = {
    OPEN: 'bg-green-100 text-green-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    CLOSED: 'bg-gray-100 text-gray-500',
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as RoomStatus)}
      disabled={loading}
      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer disabled:opacity-50 ${colorMap[status]}`}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
