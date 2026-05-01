'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function JoinRoomButton({ roomId, currentUserName }: { roomId: string; currentUserName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    setLoading(true)
    await fetch(`/api/rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({ name: currentUserName }),
      headers: { 'Content-Type': 'application/json' },
    })
    router.refresh()
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
