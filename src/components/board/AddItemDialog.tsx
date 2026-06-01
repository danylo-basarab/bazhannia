"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBoardStore } from "@/store/board-store"
import { useLang } from "@/store/lang-store"
import type { Item } from "@/types"

interface Props {
  open: boolean
  onClose: () => void
  defaultColumnId?: string
  item?: Item
}

export function AddItemDialog({ open, onClose, defaultColumnId, item }: Props) {
  const { columns, addItem, updateItem } = useBoardStore()
  const { t } = useLang()
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const [columnId, setColumnId] = useState<string>(defaultColumnId ?? "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setName(item?.name ?? "")
      setImageUrl(item?.imageUrl ?? "")
      setPrice(item?.price != null ? String(item.price) : "")
      setCategory(item?.category ?? "")
      setNotes(item?.notes ?? "")
      setColumnId(item?.columnId ?? defaultColumnId ?? columns[0]?.id ?? "")
    }
  }, [open, item, defaultColumnId, columns])

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!name.trim() || !columnId) return
    setLoading(true)
    try {
      if (item) {
        const res = await fetch(`/api/items/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            imageUrl: imageUrl.trim() || null,
            price: price ? Number(price) : null,
            category: category.trim() || null,
            notes: notes.trim() || null,
            columnId,
          }),
        })
        const updated = await res.json()
        updateItem(item.id, updated)
      } else {
        const res = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            imageUrl: imageUrl.trim() || null,
            price: price ? Number(price) : null,
            category: category.trim() || null,
            notes: notes.trim() || null,
            columnId,
          }),
        })
        const created = await res.json()
        addItem(created)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? t.editItem : t.addToWishlist}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">{t.nameLabel}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholderItem}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">{t.imageUrlLabel}</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
            {imageUrl && (
              <div className="rounded-xl overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full object-cover max-h-48"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">{t.priceLabel}</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">{t.categoryLabel}</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t.categoryPlaceholder}
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {t.categorySuggestions.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">{t.notesLabel}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.columnLabel}</Label>
            <Select value={columnId} onValueChange={(v) => v && setColumnId(v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.columnLabel}>
                  {columns.find((c) => c.id === columnId)?.name ?? ""}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t.saving : item ? t.saveChanges : t.addItemBtn}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
