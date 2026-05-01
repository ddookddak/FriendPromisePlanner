import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const room = await prisma.room.findUnique({
    where: { id: params.roomId },
    include: {
      participants: { select: { id: true, name: true } },
      _count: { select: { schedules: true } },
    },
  })

  if (!room) return NextResponse.json({ error: '방을 찾을 수 없음' }, { status: 404 })

  return NextResponse.json(room)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { name } = await req.json()

  const room = await prisma.room.findUnique({ where: { id: params.roomId } })
  if (!room) return NextResponse.json({ error: '방을 찾을 수 없음' }, { status: 404 })

  if (room.createdBy !== name) {
    return NextResponse.json({ error: '삭제 권한 없음 (방장만 가능)' }, { status: 403 })
  }

  await prisma.room.delete({ where: { id: params.roomId } })

  return NextResponse.json({ message: '방이 삭제되었습니다.' })
}
