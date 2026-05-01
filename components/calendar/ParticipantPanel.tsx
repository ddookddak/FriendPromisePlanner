import { DayData } from './CalendarView'

interface Props {
  date: string
  dayData: DayData | undefined
  onClose: () => void
}

export function ParticipantPanel({ date, dayData, onClose }: Props) {
  const participants = dayData?.participants ?? []
  const [year, month, day] = date.split('-')
  const displayDate = `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{displayDate}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium text-green-600 text-base">{participants.length}명</span>이 가능합니다
      </p>

      {participants.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">아직 아무도 선택하지 않았습니다</p>
      ) : (
        <ul className="space-y-2">
          {participants.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-medium">
                {p.name.charAt(0)}
              </div>
              <span className="text-sm text-gray-800">{p.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
