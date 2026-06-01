import type { Column, Item, User, Booking, PublishedWishlist } from "../generated/prisma"

export type { Column, Item, User, Booking, PublishedWishlist }

export type ItemWithColumn = Item & { column: Column }
export type ColumnWithItems = Column & { items: Item[] }
