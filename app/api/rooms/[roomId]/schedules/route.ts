import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const schedules = await prisma.schedule.findMany({
    where: { roomId: params.roomId },
    include: { participant: { select: { id: true, name: true } } },
  })

  const grouped: Record<string, { participants: { id: string; name: string }[] }> = {}
  for (const s of schedules) {
    const dateKey = formatDateLocal(s.date)
    if (!grouped[dateKey]) grouped[dateKey] = { participants: [] }
    grouped[dateKey].participants.push(s.participant)
  }

  return NextResponse.json(grouped)
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { date, participantName } = await req.json()

  if (!participantName) {
    return NextResponse.json({ error: '참여자 이름 필수' }, { status: 400 })
  }

  const dateObj = parseLocalDate(date)

  const participant = await prisma.participant.findUnique({
    where: { name_roomId: { name: participantName, roomId: params.roomId } },
  })

  if (!participant) {
    return NextResponse.json({ error: '참여자를 찾을 수 없음' }, { status: 404 })
  }

  const existing = await prisma.schedule.findUnique({
    where: {
      participantId_roomId_date: {
        participantId: participant.id,
        roomId: params.roomId,
        date: dateObj,
      },
    },
  })

  if (existing) {
    await prisma.schedule.delete({ where: { id: existing.id } })
    return NextResponse.json({ action: 'removed', date })
  } else {
    await prisma.schedule.create({
      data: { participantId: participant.id, roomId: params.roomId, date: dateObj },
    })
    return NextResponse.json({ action: 'added', date })
  }
}
