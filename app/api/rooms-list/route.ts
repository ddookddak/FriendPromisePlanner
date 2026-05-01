import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: {
      _count: { select: { participants: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(rooms.map(room => ({
    ...room,
    startDate: room.startDate.toISOString(),
    endDate: room.endDate.toISOString(),
    confirmedDate: room.confirmedDate ? room.confirmedDate.toISOString() : null,
  })))
}
