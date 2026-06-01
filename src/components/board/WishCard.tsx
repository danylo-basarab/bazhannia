"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MoreHorizontal, Pencil, Trash2, ExternalLink, Gift } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AddItemDialog } from "./AddItemDialog"
import { useBoardStore } from "@/store/board-store"
import { useLang } from "@/store/lang-store"
import { formatPrice, categoryColor, categoryTextColor } from "@/lib/utils"
import type { Item } from "@/types"

interface Props {
  item: Item
  overlay?: boolean
  bookedBy?: string | null
}

export function WishCard({ item, overlay = false, bookedBy = null }: Props) {
  const { removeItem } = useBoardStore()
  const { t } = useLang()
  const [editOpen, setEditOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: overlay })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  async function handleDelete() {
    await fetch(`/api/items/${item.id}`, { method: "DELETE" })
    removeItem(item.id)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none ${overlay ? "rotate-2 shadow-xl" : ""}`}
      >
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full object-cover"
            style={{ display: "block" }}
            onError={(e) => e.currentTarget.parentElement?.classList.add("no-img")}
          />
        )}

        <div className="p-3 space-y-1.5">
          <p className="font-medium text-sm leading-snug line-clamp-2">{item.name}</p>

          <div className="flex items-center justify-between gap-2">
            {item.price != null && (
              <span className="font-semibold text-sm text-foreground">
                {formatPrice(item.price)}
              </span>
            )}
            {item.category && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: categoryColor(item.category),
                  color: categoryTextColor(item.category),
                }}
              >
                {item.category}
              </span>
            )}
          </div>

          {item.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2">{item.notes}</p>
          )}
          {bookedBy && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-2 py-1">
              <Gift className="h-3 w-3 flex-shrink-0" />
              <span>{t.bookedBy} <strong>{bookedBy}</strong></span>
            </div>
          )}
        </div>

        {!overlay && (
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 rounded-full shadow-sm"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" /> {t.edit}
                </DropdownMenuItem>
                {item.imageUrl && (
                  <DropdownMenuItem asChild>
                    <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-2" /> {t.openImage}
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> {t.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <AddItemDialog open={editOpen} onClose={() => setEditOpen(false)} item={item} />
    </>
  )
}
