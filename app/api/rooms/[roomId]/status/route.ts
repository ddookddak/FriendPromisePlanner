import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['OPEN', 'CONFIRMED', 'CLOSED']

function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { status, name } = await req.json()

  const room = await prisma.room.findUnique({ where: { id: params.roomId } })
  if (!room) return NextResponse.json({ error: '방을 찾을 수 없음' }, { status: 404 })

  if (room.createdBy !== name) {
    return NextResponse.json({ error: '권한 없음 (방장만 가능)' }, { status: 403 })
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: '유효하지 않은 상태값' }, { status: 400 })
  }

  let confirmedDate: Date | null = null
  if (status === 'CONFIRMED') {
    const schedules = await prisma.schedule.findMany({ where: { roomId: params.roomId } })
    const dateCount: Record<string, number> = {}
    for (const s of schedules) {
      const key = formatDateLocal(s.date)
      dateCount[key] = (dateCount[key] ?? 0) + 1
    }

    const sorted = Object.entries(dateCount).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    if (sorted.length > 0) {
      confirmedDate = parseLocalDate(sorted[0][0])
    }
  }

  const updated = await prisma.room.update({
    where: { id: params.roomId },
    data: { status, confirmedDate },
  })

  return NextResponse.json({ id: updated.id, status: updated.status, confirmedDate: updated.confirmedDate })
}
