import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const columns = await prisma.column.findMany({
    where: { userId: session.user.id },
    orderBy: { position: "asc" },
  })
  return NextResponse.json(columns)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, color } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })

  const last = await prisma.column.findFirst({
    where: { userId: session.user.id },
    orderBy: { position: "desc" },
  })

  const column = await prisma.column.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      color: color ?? "#e2e8f0",
      position: (last?.position ?? 0) + 1000,
    },
  })
  return NextResponse.json(column, { status: 201 })
}
