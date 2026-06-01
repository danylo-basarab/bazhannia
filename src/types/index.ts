import type { Column, Item, User, Booking, PublishedWishlist } from "@prisma/client"

export type { Column, Item, User, Booking, PublishedWishlist }

export type ItemWithColumn = Item & { column: Column }
export type ColumnWithItems = Column & { items: Item[] }
