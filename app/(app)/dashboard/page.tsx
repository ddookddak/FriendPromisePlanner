'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RoomCard } from '@/components/room/RoomCard'

interface Room {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date
  createdBy: string
  status: string
  confirmedDate: string | null
  _count: { participants: number }
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rooms-list')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center py-20">로드 중...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">약속 방 목록</h1>
        <Link
          href="/rooms/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          + 방 만들기
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">아직 약속 방이 없습니다.</p>
          <p className="text-sm">새로운 방을 만들어보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  )
}
