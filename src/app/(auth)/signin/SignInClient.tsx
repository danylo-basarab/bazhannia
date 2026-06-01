"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useLang } from "@/store/lang-store"

const GUEST_TOKEN_KEY = "wishlist_guest_token"

export function SignInClient() {
  const { t, lang, setLang } = useLang()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(GUEST_TOKEN_KEY)
    if (stored) {
      setLoading(true)
      signIn("guest", { guestToken: stored, name: "", callbackUrl: "/board" })
    }
  }, [])

  async function handleStart(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn("guest", {
      name: name.trim() || "Guest",
      guestToken: "",
      callbackUrl: "/board",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed top-4 right-4">
        <button
          type="button"
          onClick={() => setLang(lang === "uk" ? "en" : "uk")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
        >
          {lang === "uk" ? "EN" : "УК"}
        </button>
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{t.appName}</h1>
          <p className="text-muted-foreground text-sm">{t.appSubtitle}</p>
        </div>

        <form onSubmit={handleStart} className="space-y-3">
          <Input
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-2xl text-sm"
            autoFocus
          />
          <Button type="submit" className="w-full rounded-2xl h-12 text-sm font-medium">
            {t.startButton}
          </Button>
        </form>

        <div className="w-full rounded-2xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800 dark:bg-yellow-950/40 dark:border-yellow-800/50 dark:text-yellow-300">
          {t.signInFooter}
        </div>
      </div>
    </div>
  )
}
