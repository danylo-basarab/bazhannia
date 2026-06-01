"use client"

import { DragOverlay as DndDragOverlay } from "@dnd-kit/core"
import { WishCard } from "./WishCard"
import type { Item } from "@/types"

interface Props {
  activeItem: Item | null
}

export function DragOverlay({ activeItem }: Props) {
  return (
    <DndDragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18,0.67,0.6,1.22)" }}>
      {activeItem && <WishCard item={activeItem} overlay />}
    </DndDragOverlay>
  )
}
