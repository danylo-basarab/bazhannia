"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    if (!initialized.current) {
      setBoard(initialColumns, initialItems)
      initialized.current = true
    }
  }, [initialColumns, initialItems, setBoard])

  const categories = useMemo(() => {
    const normalized = new Map<string, string>()

    items.forEach((item) => {
      const category = item.category?.trim()
      if (!category) return
      const key = category.toLowerCase()
      if (!normalized.has(key)) normalized.set(key, category)
    })

    return Array.from(normalized.values())
  }, [items])

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return items
    return items.filter((item) => item.category?.trim().toLowerCase() === selectedCategory.toLowerCase())
  }, [items, selectedCategory])

  const categoryPalette = [
    { inactive: "border-pink-500/60 bg-pink-500/10 text-pink-700 dark:text-pink-200 hover:bg-pink-500/15", active: "border-pink-500 bg-pink-500 text-white shadow-[0_0_0_2px_rgba(236,72,153,0.25)] hover:bg-pink-600" },
    { inactive: "border-violet-500/60 bg-violet-500/10 text-violet-700 dark:text-violet-200 hover:bg-violet-500/15", active: "border-violet-500 bg-violet-500 text-white shadow-[0_0_0_2px_rgba(139,92,246,0.25)] hover:bg-violet-600" },
    { inactive: "border-cyan-500/60 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-500/15", active: "border-cyan-500 bg-cyan-500 text-white shadow-[0_0_0_2px_rgba(6,182,212,0.25)] hover:bg-cyan-600" },
    { inactive: "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-500/15", active: "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_0_2px_rgba(16,185,129,0.25)] hover:bg-emerald-600" },
    { inactive: "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-200 hover:bg-amber-500/15", active: "border-amber-500 bg-amber-500 text-white shadow-[0_0_0_2px_rgba(245,158,11,0.25)] hover:bg-amber-600" },
    { inactive: "border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-200 hover:bg-rose-500/15", active: "border-rose-500 bg-rose-500 text-white shadow-[0_0_0_2px_rgba(244,63,94,0.25)] hover:bg-rose-600" },
    { inactive: "border-sky-500/60 bg-sky-500/10 text-sky-700 dark:text-sky-200 hover:bg-sky-500/15", active: "border-sky-500 bg-sky-500 text-white shadow-[0_0_0_2px_rgba(14,165,233,0.25)] hover:bg-sky-600" },
    { inactive: "border-fuchsia-500/60 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-200 hover:bg-fuchsia-500/15", active: "border-fuchsia-500 bg-fuchsia-500 text-white shadow-[0_0_0_2px_rgba(217,70,239,0.25)] hover:bg-fuchsia-600" },
  ]

  function getCategoryClasses(category: string, active: boolean) {
    const paletteIndex = [...category].reduce((acc, char) => acc + char.charCodeAt(0), 0) % categoryPalette.length
    const palette = categoryPalette[paletteIndex]

    return active ? `border-2 ${palette.active}` : `border ${palette.inactive}`
  }

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
      <div className="px-4 pt-4 pb-2">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card/60 p-2 backdrop-blur-sm">
          <Button
            type="button"
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>
          {categories.map((category) => {
            const active = selectedCategory.toLowerCase() === category.toLowerCase()

            return (
              <Button
                key={category}
                type="button"
                size="sm"
                className={`rounded-full ${getCategoryClasses(category, active)}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            )
          })}
        </div>
      </div>

      {/* columns: vertical on mobile, horizontal on desktop */}
      <div className="sm:overflow-x-auto min-h-full">
        <div className="flex flex-col sm:flex-row gap-4 pb-52 sm:pb-6 pt-2 px-4 sm:items-start sm:w-fit sm:mx-auto">
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              items={filteredItems
                .filter((i) => i.columnId === col.id)
                .sort((a, b) => a.position - b.position)}
              bookingsByItemId={bookingsByItemId}
            />
          ))}
          <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
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
