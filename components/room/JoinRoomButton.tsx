'use client'
import { useState } from 'react'

interface Props {
  roomId: string
  currentUserName: string
  onJoinSuccess?: () => void
}

export function JoinRoomButton({ roomId, currentUserName, onJoinSuccess }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    setLoading(true)
    try {
      const res = await fetch(`/api/rooms/${roomId}/join`, {
        method: 'POST',
        body: JSON.stringify({ name: currentUserName }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        onJoinSuccess?.()
      } else {
        alert('참여에 실패했습니다.')
        setLoading(false)
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? '참여 중...' : '이 방에 참여하기'}
    </button>
  )
}
