"use client"

import { useState } from "react"
import { Copy, Check, Link2, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLang } from "@/store/lang-store"

interface Props {
  open: boolean
  onClose: () => void
  published: { token: string } | null
  onPublish: (token: string) => void
  onUnpublish: () => void
}

export function ShareDialog({ open, onClose, published, onPublish, onUnpublish }: Props) {
  const { t } = useLang()
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = published
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${published.token}`
    : null

  async function handlePublish() {
    setLoading(true)
    try {
      const res = await fetch("/api/wishlists/publish", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        onPublish(data.token)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleUnpublish() {
    setLoading(true)
    try {
      await fetch("/api/wishlists/publish", { method: "DELETE" })
      onUnpublish()
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-4 w-4" /> {t.shareTitle}
          </DialogTitle>
        </DialogHeader>

        {!published ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">{t.sharePublishDesc}</p>
            <Button className="w-full" onClick={handlePublish} disabled={loading}>
              {loading ? t.publishing : t.sharePublishBtn}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">{t.shareLinkDesc}</p>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl ?? ""} className="text-xs font-mono" />
              <Button size="icon" variant="outline" onClick={handleCopy} className="flex-shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleUnpublish}
              disabled={loading}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {loading ? t.unpublishing : t.unpublish}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
