"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBoardStore } from "@/store/board-store"
import { useLang } from "@/store/lang-store"

const PRESET_COLORS = [
  "#fecdd3", "#fed7aa", "#fef08a", "#bbf7d0",
  "#bfdbfe", "#ddd6fe", "#fbcfe8", "#e2e8f0",
]

interface Props {
  open: boolean
  onClose: () => void
}

export function AddColumnDialog({ open, onClose }: Props) {
  const { addColumn } = useBoardStore()
  const { t } = useLang()
  const [name, setName] = useState("")
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color }),
      })
      const col = await res.json()
      addColumn(col)
      setName("")
      setColor(PRESET_COLORS[0])
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t.addColumnTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="col-name">{t.columnNameLabel}</Label>
            <Input
              id="col-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.columnNamePlaceholder}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.colorLabel}</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "currentColor" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t.creating : t.create}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
