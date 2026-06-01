import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const columnId = searchParams.get("columnId")

  const items = await prisma.item.findMany({
    where: {
      userId: session.user.id,
      ...(columnId ? { columnId } : {}),
    },
    orderBy: { position: "asc" },
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })
  if (!body.columnId) return NextResponse.json({ error: "columnId is required" }, { status: 400 })

  const col = await prisma.column.findUnique({ where: { id: body.columnId } })
  if (!col || col.userId !== session.user.id)
    return NextResponse.json({ error: "Column not found" }, { status: 404 })

  const last = await prisma.item.findFirst({
    where: { columnId: body.columnId },
    orderBy: { position: "desc" },
  })

  const item = await prisma.item.create({
    data: {
      userId: session.user.id,
      columnId: body.columnId,
      name: body.name.trim(),
      price: body.price != null ? Number(body.price) : null,
      category: body.category?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      notes: body.notes?.trim() || null,
      position: (last?.position ?? 0) + 1000,
    },
  })
  return NextResponse.json(item, { status: 201 })
}
