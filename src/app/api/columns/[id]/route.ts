import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const column = await prisma.column.findUnique({ where: { id } })
  if (!column || column.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.column.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.color !== undefined && { color: body.color }),
      ...(body.position !== undefined && { position: body.position }),
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const column = await prisma.column.findUnique({ where: { id } })
  if (!column || column.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.column.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
