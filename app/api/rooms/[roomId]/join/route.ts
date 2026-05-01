import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { name } = await req.json()

  if (!name) {
    return NextResponse.json({ error: '이름 필수' }, { status: 400 })
  }

  const room = await prisma.room.findUnique({ where: { id: params.roomId } })
  if (!room) return NextResponse.json({ error: '방 없음' }, { status: 404 })

  await prisma.participant.upsert({
    where: { name_roomId: { name, roomId: params.roomId } },
    update: {},
    create: { name, roomId: params.roomId },
  })

  return NextResponse.json({ message: '참여 완료' })
}
