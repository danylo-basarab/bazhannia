import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const item = await prisma.item.findUnique({ where: { id } })
  if (!item || item.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.item.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.price !== undefined && { price: body.price != null ? Number(body.price) : null }),
      ...(body.category !== undefined && { category: body.category || null }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
      ...(body.notes !== undefined && { notes: body.notes || null }),
      ...(body.columnId !== undefined && { columnId: body.columnId }),
      ...(body.position !== undefined && { position: body.position }),
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const item = await prisma.item.findUnique({ where: { id } })
  if (!item || item.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.item.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
