import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ShareView } from "./ShareView"

type Params = { params: Promise<{ token: string }> }

export default async function SharePage({ params }: Params) {
  const { token } = await params

  const published = await prisma.publishedWishlist.findUnique({
    where: { token },
    include: { user: { select: { name: true } } },
  })
  if (!published) notFound()

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

  return (
    <ShareView
      token={token}
      ownerName={published.user.name ?? ""}
      initialColumns={columns}
      initialItems={items}
      initialBookings={bookings}
    />
  )
}
