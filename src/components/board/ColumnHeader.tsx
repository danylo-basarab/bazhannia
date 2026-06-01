"use client"

import { useState, useRef } from "react"
import { Plus, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddItemDialog } from "./AddItemDialog"
import { useBoardStore } from "@/store/board-store"
import { useLang } from "@/store/lang-store"
import type { Column } from "@/types"

const PRESET_COLORS = [
  "#fecdd3", "#fed7aa", "#fef08a", "#bbf7d0",
  "#bfdbfe", "#ddd6fe", "#fbcfe8", "#e2e8f0",
]

interface Props {
  column: Column
  itemCount: number
}

export function ColumnHeader({ column, itemCount }: Props) {
  const { updateColumn, removeColumn } = useBoardStore()
  const { t } = useLang()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(column.name)
  const [addOpen, setAddOpen] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function saveTitle() {
    setEditing(false)
    const trimmed = title.trim()
    if (!trimmed || trimmed === column.name) {
      setTitle(column.name)
      return
    }
    updateColumn(column.id, { name: trimmed })
    await fetch(`/api/columns/${column.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    })
  }

  async function handleColorChange(color: string) {
    setShowColors(false)
    updateColumn(column.id, { color })
    await fetch(`/api/columns/${column.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    })
  }

  async function handleDelete() {
    removeColumn(column.id)
    await fetch(`/api/columns/${column.id}`, { method: "DELETE" })
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2.5">
      <div className="relative">
        <button
          onClick={() => setShowColors(!showColors)}
          className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-1 ring-black/10 hover:ring-black/30 transition-all"
          style={{ backgroundColor: column.color }}
        />
        {showColors && (
          <div className="absolute top-5 left-0 z-50 bg-popover border border-border rounded-xl p-2 shadow-lg flex flex-wrap gap-1.5 w-24">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => handleColorChange(c)}
                className="w-7 h-7 rounded-full hover:scale-110 transition-transform ring-1 ring-black/10"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>

      {editing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle()
            if (e.key === "Escape") { setTitle(column.name); setEditing(false) }
          }}
          className="flex-1 bg-transparent font-semibold text-sm outline-none border-b border-foreground min-w-0"
          autoFocus
        />
      ) : (
        <button
          onClick={startEdit}
          className="flex-1 text-left font-semibold text-sm truncate hover:opacity-70 transition-opacity min-w-0"
        >
          {column.name}
        </button>
      )}

      <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
        {itemCount}
      </span>

      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 flex-shrink-0"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-accent transition-colors flex-shrink-0">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" /> {t.deleteColumn}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddItemDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        defaultColumnId={column.id}
      />
    </div>
  )
}
