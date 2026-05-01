'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarView } from '@/components/calendar/CalendarView'
import { JoinRoomButton } from '@/components/room/JoinRoomButton'
import { CopyLinkButton } from '@/components/room/CopyLinkButton'
import { DeleteRoomButton } from '@/components/room/DeleteRoomButton'
import { RoomStatusBadge } from '@/components/room/RoomStatusBadge'

interface Props {
  params: { roomId: string }
}

interface Room {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date
  createdBy: string
  status: string
  confirmedDate: string | null
  participants: Array<{ id: string; name: string }>
  _count: { schedules: number }
}

export default function RoomPage({ params }: Props) {
  const router = useRouter()
  const [room, setRoom] = useState<Room | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/rooms/${params.roomId}`)
      const data = await res.json()
      setRoom(data)
    } catch (error) {
      console.error('Failed to fetch room:', error)
    }
  }

  const handleStatusChange = (newStatus: string, confirmedDate: string | null) => {
    if (room) {
      setRoom({ ...room, status: newStatus, confirmedDate })
    }
  }

  const handleJoinSuccess = () => {
    fetchRoom()
  }

  useEffect(() => {
    const nickname = localStorage.getItem('nickname')
    if (!nickname) {
      router.push('/')
      return
    }
    setCurrentUserName(nickname)

    fetchRoom().then(() => setLoading(false))
  }, [params.roomId, router])

  if (loading) return <div className="text-center py-20">로드 중...</div>
  if (!room) return <div className="text-center py-20">방을 찾을 수 없습니다.</div>

  const isMember = room.participants.some((p) => p.name === currentUserName)
  const isCreator = room.createdBy === currentUserName

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{room.title}</h1>
              {isCreator ? (
                <RoomStatusBadge
                  roomId={room.id}
                  initialStatus={room.status as 'OPEN' | 'CONFIRMED' | 'CLOSED'}
                  currentUserName={currentUserName || ''}
                  onStatusChange={handleStatusChange}
                />
              ) : (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    room.status === 'OPEN'
                      ? 'bg-green-100 text-green-700'
                      : room.status === 'CONFIRMED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {room.status === 'OPEN' ? '모집 중' : room.status === 'CONFIRMED' ? '확정' : '마감'}
                </span>
              )}
            </div>
            {room.description && <p className="text-gray-500 mt-1">{room.description}</p>}
            <p className="text-sm text-gray-400 mt-1">
              {new Date(room.startDate).toLocaleDateString('ko-KR')} ~{' '}
              {new Date(room.endDate).toLocaleDateString('ko-KR')} · {room.participants.length}명 참여
            </p>
          </div>
          <div className="flex gap-2">
            <CopyLinkButton roomId={room.id} />
            {isCreator && <DeleteRoomButton roomId={room.id} roomTitle={room.title} currentUserName={currentUserName || ''} />}
          </div>
        </div>

        {room.status === 'CONFIRMED' && room.confirmedDate && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              ✓ 확정된 약속일: <strong>{new Date(room.confirmedDate).toLocaleDateString('ko-KR')}</strong>
            </p>
          </div>
        )}

        {!isMember && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-3">이 방에 아직 참여하지 않았습니다.</p>
            <JoinRoomButton roomId={room.id} currentUserName={currentUserName || ''} onJoinSuccess={handleJoinSuccess} />
          </div>
        )}
      </div>

      {isMember && (
        <CalendarView
          roomId={room.id}
          startDate={typeof room.startDate === 'string' ? room.startDate : room.startDate.toISOString()}
          endDate={typeof room.endDate === 'string' ? room.endDate : room.endDate.toISOString()}
          totalMembers={room.participants.length}
          currentUserName={currentUserName || ''}
          roomStatus={room.status}
        />
      )}
    </div>
  )
}
