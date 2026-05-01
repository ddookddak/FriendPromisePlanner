import Link from 'next/link'

interface Props {
  room: {
    id: string
    title: string
    description: string | null
    startDate: Date
    endDate: Date
    createdBy: string
    status: string
    _count: { participants: number }
  }
}

const statusLabel: Record<string, { label: string; color: string }> = {
  OPEN: { label: '모집 중', color: 'bg-green-100 text-green-700' },
  CONFIRMED: { label: '확정', color: 'bg-blue-100 text-blue-700' },
  CLOSED: { label: '마감', color: 'bg-gray-100 text-gray-500' },
}

export function RoomCard({ room }: Props) {
  const status = statusLabel[room.status] || statusLabel.OPEN
  const start = new Date(room.startDate).toLocaleDateString('ko-KR')
  const end = new Date(room.endDate).toLocaleDateString('ko-KR')

  return (
    <Link href={`/rooms/${room.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-green-300 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h2 className="font-semibold text-gray-900 text-base leading-tight">{room.title}</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        {room.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{room.description}</p>
        )}
        <div className="text-xs text-gray-400 space-y-1">
          <p>📅 {start} ~ {end}</p>
          <p>👥 {room._count.participants}명 참여</p>
          <p>✏️ 생성: {room.createdBy}</p>
        </div>
      </div>
    </Link>
  )
}
