import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { title, description, startDate, endDate, createdBy } = await req.json()

  if (!title || !startDate || !endDate || !createdBy) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }

  const room = await prisma.room.create({
    data: {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy,
      participants: {
        create: { name: createdBy },
      },
    },
  })

  return NextResponse.json(room, { status: 201 })
}
