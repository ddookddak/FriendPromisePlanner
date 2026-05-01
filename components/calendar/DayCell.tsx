import { DayData } from './CalendarView'
import { getHeatmapClass } from '@/lib/utils'

interface Props {
  date: Date
  dayData: DayData | undefined
  totalMembers: number
  isSelected: boolean
  isToggling: boolean
  isDisabled?: boolean
  onSelect: () => void
  onToggle: () => void
}

export function DayCell({
  date,
  dayData,
  totalMembers,
  isSelected,
  isToggling,
  isDisabled,
  onSelect,
  onToggle,
}: Props) {
  const count = dayData?.participants.length ?? 0
  const isMySchedule = dayData?.isMySchedule ?? false
  const ratio = totalMembers > 0 ? count / totalMembers : 0
  const dayOfWeek = date.getDay()

  const heatmapClass = count > 0 ? getHeatmapClass(ratio) : 'bg-gray-50 text-gray-400'
  const selectedRing = isSelected ? 'ring-2 ring-green-600 ring-offset-1' : ''
  const myBorder = isMySchedule ? 'border-2 border-green-500' : 'border border-gray-200'

  return (
    <div
      className={`
        relative aspect-square rounded-lg flex flex-col items-center justify-center
        transition-all select-none
        ${heatmapClass} ${selectedRing} ${myBorder}
        ${isDisabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
        ${isToggling ? 'opacity-50' : !isDisabled ? 'hover:opacity-90' : ''}
      `}
      onClick={isDisabled ? undefined : onSelect}
    >
      <span
        className={`text-sm font-medium ${
          dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : ''
        }`}
      >
        {date.getDate()}
      </span>
      {count > 0 && (
        <span className="text-xs opacity-80">{count}명</span>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        disabled={isDisabled}
        className={`
          absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center
          transition-colors
          ${isDisabled
            ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
            : isMySchedule
              ? 'bg-green-600 text-white hover:bg-red-500 cursor-pointer'
              : 'bg-white border border-gray-300 text-gray-400 hover:bg-green-100 hover:border-green-400 cursor-pointer'
          }
        `}
        title={isDisabled ? '상태가 확정되어 수정할 수 없습니다' : isMySchedule ? '클릭하여 취소' : '클릭하여 참여'}
      >
        {isMySchedule ? '✓' : '+'}
      </button>
    </div>
  )
}
