import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOrCreateColumns } from "@/lib/get-or-create-columns"
import { BoardClient } from "@/components/board/BoardClient"

export default async function BoardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/signin")

  const columns = await getOrCreateColumns(session.user.id)
  const [items, publishedWishlist] = await Promise.all([
    prisma.item.findMany({
      where: { userId: session.user.id },
      orderBy: { position: "asc" },
    }),
    prisma.publishedWishlist.findUnique({
      where: { userId: session.user.id },
      include: { bookings: true },
    }),
  ])

  const bookingsByItemId = Object.fromEntries(
    (publishedWishlist?.bookings ?? []).map((b) => [b.itemId, b.bookerName])
  )

  return (
    <div>
      <BoardClient
        initialColumns={columns}
        initialItems={items}
        publishedToken={publishedWishlist?.token ?? null}
        bookingsByItemId={bookingsByItemId}
      />
    </div>
  )
}
