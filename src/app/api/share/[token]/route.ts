import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ token: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { token } = await params

  const published = await prisma.publishedWishlist.findUnique({
    where: { token },
    include: { user: { select: { name: true } } },
  })
  if (!published) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const [columns, items, bookings] = await Promise.all([
    prisma.column.findMany({
      where: { userId: published.userId },
      orderBy: { position: "asc" },
    }),
    prisma.item.findMany({
      where: { userId: published.userId },
      orderBy: { position: "asc" },
    }),
    prisma.booking.findMany({
      where: { publishedListId: published.id },
    }),
  ])

  return NextResponse.json({
    ownerName: published.user.name,
    columns,
    items,
    bookings,
  })
}
