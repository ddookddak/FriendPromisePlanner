import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['OPEN', 'CONFIRMED', 'CLOSED']

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

  const updated = await prisma.room.update({
    where: { id: params.roomId },
    data: { status },
  })

  return NextResponse.json({ id: updated.id, status: updated.status })
}
