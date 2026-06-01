"use client"

import { useEffect, useRef, useState } from "react"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Plus, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BoardColumn } from "./BoardColumn"
import { DragOverlay } from "./DragOverlay"
import { AddItemDialog } from "./AddItemDialog"
import { AddColumnDialog } from "./AddColumnDialog"
import { ShareDialog } from "./ShareDialog"
import { useBoardStore } from "@/store/board-store"
import { useLang } from "@/store/lang-store"
import { getNewPosition } from "@/lib/board-utils"
import type { Column, Item } from "@/types"

interface Props {
  initialColumns: Column[]
  initialItems: Item[]
  publishedToken: string | null
  bookingsByItemId: Record<string, string>
}

export function BoardClient({ initialColumns, initialItems, publishedToken, bookingsByItemId }: Props) {
  const { columns, items, setBoard, moveItem, setIsDragging } = useBoardStore()
  const { t } = useLang()
  const initialized = useRef(false)
  const dragOrigin = useRef<{ columnId: string; position: number } | null>(null)
  const [activeItem, setActiveItem] = useState<Item | null>(null)
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [addColOpen, setAddColOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [publishedToken_, setPublishedToken] = useState<string | null>(publishedToken)

  useEffect(() => {
    if (!initialized.current) {
      setBoard(initialColumns, initialItems)
      initialized.current = true
    }
  }, [initialColumns, initialItems, setBoard])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function onDragStart(event: DragStartEvent) {
    const item = items.find((i) => i.id === event.active.id)
    if (item) {
      setActiveItem(item)
      setIsDragging(true)
      dragOrigin.current = { columnId: item.columnId, position: item.position }
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    const activeItem = items.find((i) => i.id === activeId)
    if (!activeItem) return

    // over a column id
    const overColumn = columns.find((c) => c.id === overId)
    if (overColumn && activeItem.columnId !== overColumn.id) {
      const colItems = items.filter((i) => i.columnId === overColumn.id)
      const newPos = getNewPosition(
        colItems[colItems.length - 1]?.position ?? null,
        null
      )
      moveItem(activeId, overColumn.id, newPos)
    }

    // over an item id
    const overItem = items.find((i) => i.id === overId)
    if (overItem && overItem.columnId !== activeItem.columnId) {
      moveItem(activeId, overItem.columnId, overItem.position - 0.5)
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    setIsDragging(false)

    const origin = dragOrigin.current
    dragOrigin.current = null

    const { active, over } = event
    if (!over || !origin) return

    const activeId = active.id as string
    const overId = over.id as string

    const movedItem = items.find((i) => i.id === activeId)
    if (!movedItem) return

    const colItems = items
      .filter((i) => i.columnId === movedItem.columnId)
      .sort((a, b) => a.position - b.position)

    const oldIndex = colItems.findIndex((i) => i.id === activeId)
    const newIndex = colItems.findIndex((i) => i.id === overId)

    let newPosition: number

    if (newIndex === -1 || newIndex === oldIndex) {
      newPosition = movedItem.position
    } else {
      const reordered = arrayMove(colItems, oldIndex, newIndex)
      const idx = reordered.findIndex((i) => i.id === activeId)
      const before = reordered[idx - 1]?.position ?? null
      const after = reordered[idx + 1]?.position ?? null
      newPosition = getNewPosition(before, after)
    }

    const columnChanged = movedItem.columnId !== origin.columnId
    const positionChanged = newPosition !== origin.position

    if (columnChanged || positionChanged) {
      moveItem(activeId, movedItem.columnId, newPosition)

      fetch(`/api/items/${activeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId: movedItem.columnId, position: newPosition }),
      }).catch(() => moveItem(activeId, origin.columnId, origin.position))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {/* desktop: horizontal scroll, mobile: vertical stack */}
      <div className="hidden sm:block overflow-x-auto min-h-full">
        <div className="flex gap-4 pb-6 pt-2 px-4 items-start w-fit mx-auto">
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              items={items
                .filter((i) => i.columnId === col.id)
                .sort((a, b) => a.position - b.position)}
              bookingsByItemId={bookingsByItemId}
            />
          ))}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button variant="outline" className="h-10 rounded-2xl border-dashed gap-2 whitespace-nowrap" onClick={() => setAddColOpen(true)}>
              <Plus className="h-4 w-4" /> {t.addColumn}
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl border-dashed gap-2 whitespace-nowrap" onClick={() => setAddItemOpen(true)}>
              <Plus className="h-4 w-4" /> {t.addItem}
            </Button>
            <Button variant={publishedToken_ ? "default" : "outline"} className="h-10 rounded-2xl gap-2 whitespace-nowrap" onClick={() => setShareOpen(true)}>
              <Share2 className="h-4 w-4" /> {publishedToken_ ? t.shared : t.share}
            </Button>
          </div>
        </div>
      </div>

      {/* mobile: vertical stack */}
      <div className="sm:hidden flex flex-col gap-4 px-4 pt-2 pb-52">
        {columns.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            items={items
              .filter((i) => i.columnId === col.id)
              .sort((a, b) => a.position - b.position)}
            bookingsByItemId={bookingsByItemId}
          />
        ))}
      </div>

      {/* mobile bottom action bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border/50 flex flex-col gap-2 px-4 py-3 z-30">
        <Button variant="outline" className="w-full rounded-2xl border-dashed gap-2" onClick={() => setAddItemOpen(true)}>
          <Plus className="h-4 w-4" /> {t.addItem}
        </Button>
        <Button variant="outline" className="w-full rounded-2xl border-dashed gap-2" onClick={() => setAddColOpen(true)}>
          <Plus className="h-4 w-4" /> {t.addColumn}
        </Button>
        <Button variant={publishedToken_ ? "default" : "outline"} className="w-full rounded-2xl gap-2" onClick={() => setShareOpen(true)}>
          <Share2 className="h-4 w-4" /> {publishedToken_ ? t.shared : t.share}
        </Button>
      </div>

      <DragOverlay activeItem={activeItem} />

      <AddItemDialog
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        defaultColumnId={columns[0]?.id}
      />
      <AddColumnDialog open={addColOpen} onClose={() => setAddColOpen(false)} />
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        published={publishedToken_ ? { token: publishedToken_ } : null}
        onPublish={(token) => setPublishedToken(token)}
        onUnpublish={() => setPublishedToken(null)}
      />
    </DndContext>
  )
}
