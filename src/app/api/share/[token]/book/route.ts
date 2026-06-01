import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ token: string }> }

export async function POST(req: Request, { params }: Params) {
  const { token } = await params

  const published = await prisma.publishedWishlist.findUnique({ where: { token } })
  if (!published) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const bookerName = body.bookerName?.trim()
  const itemId = body.itemId?.trim()

  if (!bookerName) return NextResponse.json({ error: "Name is required" }, { status: 400 })
  if (!itemId) return NextResponse.json({ error: "itemId is required" }, { status: 400 })

  const item = await prisma.item.findUnique({ where: { id: itemId } })
  if (!item || item.userId !== published.userId)
    return NextResponse.json({ error: "Item not found" }, { status: 404 })

  const existing = await prisma.booking.findUnique({
    where: { publishedListId_itemId: { publishedListId: published.id, itemId } },
  })
  if (existing) return NextResponse.json({ error: "Already booked" }, { status: 409 })

  const booking = await prisma.booking.create({
    data: { publishedListId: published.id, itemId, bookerName },
  })
  return NextResponse.json(booking, { status: 201 })
}
