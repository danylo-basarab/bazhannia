import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const existing = await prisma.publishedWishlist.findUnique({
    where: { userId: session.user.id },
  })
  if (existing) return NextResponse.json(existing)

  const published = await prisma.publishedWishlist.create({
    data: {
      userId: session.user.id,
      token: randomBytes(16).toString("hex"),
    },
  })
  return NextResponse.json(published, { status: 201 })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.publishedWishlist.deleteMany({ where: { userId: session.user.id } })
  return new NextResponse(null, { status: 204 })
}
