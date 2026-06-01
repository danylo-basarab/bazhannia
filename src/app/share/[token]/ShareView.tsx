"use client"

import { useState } from "react"
import { Gift, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice, categoryColor, categoryTextColor } from "@/lib/utils"
import { useLang } from "@/store/lang-store"
import type { Column, Item, Booking } from "@/types"

interface Props {
  token: string
  ownerName: string
  initialColumns: Column[]
  initialItems: Item[]
  initialBookings: Booking[]
}

export function ShareView({ token, ownerName, initialColumns, initialItems, initialBookings }: Props) {
  const { t, lang, setLang } = useLang()
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [bookingItem, setBookingItem] = useState<Item | null>(null)
  const [bookerName, setBookerName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function getBooking(itemId: string) {
    return bookings.find((b) => b.itemId === itemId)
  }

  async function handleBook() {
    if (!bookingItem || !bookerName.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/share/${token}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: bookingItem.id, bookerName: bookerName.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Something went wrong")
        return
      }
      const booking: Booking = await res.json()
      setBookings((prev) => [...prev, booking])
      setBookingItem(null)
      setBookerName("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4 gap-3">
        <span className="font-bold tracking-tight text-base">{t.appName}</span>
        {ownerName && (
          <span className="text-muted-foreground text-sm">{t.ownerWishlist(ownerName)}</span>
        )}
        <div className="flex-1" />
        <button
          onClick={() => setLang(lang === "uk" ? "en" : "uk")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
        >
          {lang === "uk" ? "EN" : "УК"}
        </button>
      </header>

      <main className="p-4">
        <div className="sm:overflow-x-auto">
          <div className="flex flex-col sm:flex-row gap-4 pb-6 pt-2 sm:items-start sm:w-fit sm:mx-auto">
            {initialColumns.map((col) => {
              const colItems = initialItems
                .filter((i) => i.columnId === col.id)
                .sort((a, b) => a.position - b.position)

              return (
                <div key={col.id} className="w-full sm:flex-shrink-0 sm:w-72">
                  <div
                    className="rounded-2xl px-3 py-2 mb-3 flex items-center gap-2"
                    style={{ backgroundColor: col.color + "33" }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="font-semibold text-sm">{col.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{colItems.length}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {colItems.map((item) => {
                      const booking = getBooking(item.id)
                      return (
                        <div key={item.id} className="bg-card rounded-2xl overflow-hidden shadow-sm">
                          {item.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.imageUrl} alt={item.name} className="w-full object-cover" />
                          )}
                          <div className="p-3 space-y-1.5">
                            <p className="font-medium text-sm leading-snug line-clamp-2">{item.name}</p>
                            <div className="flex items-center justify-between gap-2">
                              {item.price != null && (
                                <span className="font-semibold text-sm">{formatPrice(item.price)}</span>
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
                            <div className="pt-1">
                              {booking ? (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1.5">
                                  <Gift className="h-3 w-3 flex-shrink-0" />
                                  <span>{t.bookedBy} <strong>{booking.bookerName}</strong></span>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full h-8 text-xs rounded-xl gap-1.5"
                                  onClick={() => setBookingItem(item)}
                                >
                                  <ShoppingBag className="h-3 w-3" /> {t.iWillGift}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <Dialog
        open={!!bookingItem}
        onOpenChange={(o) => { if (!o) { setBookingItem(null); setBookerName(""); setError("") } }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{bookingItem ? t.bookTitle(bookingItem.name) : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">{t.bookDesc}</p>
            <div className="space-y-1.5">
              <Label htmlFor="booker-name">{t.yourName}</Label>
              <Input
                id="booker-name"
                placeholder={t.yourNamePlaceholder}
                value={bookerName}
                onChange={(e) => setBookerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBook()}
                autoFocus
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setBookingItem(null); setBookerName(""); setError("") }}>
              {t.cancel}
            </Button>
            <Button onClick={handleBook} disabled={!bookerName.trim() || loading}>
              {loading ? t.booking : t.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
