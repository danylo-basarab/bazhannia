"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ColumnHeader } from "./ColumnHeader"
import { WishCard } from "./WishCard"
import { useLang } from "@/store/lang-store"
import type { Column, Item } from "@/types"

interface Props {
  column: Column
  items: Item[]
  bookingsByItemId: Record<string, string>
}

export function BoardColumn({ column, items, bookingsByItemId }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const { t } = useLang()

  return (
    <div className="flex flex-col w-full sm:w-72 sm:flex-shrink-0">
      <div
        className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm flex flex-col transition-colors"
        style={{ outline: isOver ? `2px solid ${column.color}` : undefined }}
      >
        <ColumnHeader column={column} itemCount={items.length} />

        <div
          ref={setNodeRef}
          className="px-2.5 pb-2.5 space-y-2.5 min-h-[80px]"
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <WishCard key={item.id} item={item} bookedBy={bookingsByItemId[item.id] ?? null} />
            ))}
          </SortableContext>

          {items.length === 0 && (
            <div className="h-16 flex items-center justify-center text-xs text-muted-foreground/50 border-2 border-dashed border-border/30 rounded-xl">
              {t.dropHere}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
