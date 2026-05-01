'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  roomId: string
  roomTitle: string
  currentUserName: string
}

export function DeleteRoomButton({ roomId, roomTitle, currentUserName }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`"${roomTitle}" 방을 삭제하시겠습니까?\n참여자와 일정 데이터가 모두 삭제됩니다.`)) return

    setLoading(true)
    const res = await fetch(`/api/rooms/${roomId}`, {
      method: 'DELETE',
      body: JSON.stringify({ name: currentUserName }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      router.push('/dashboard')
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || '삭제 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? '삭제 중...' : '방 삭제'}
    </button>
  )
}
