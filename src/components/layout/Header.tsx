"use client"

import { useSession, signOut } from "next-auth/react"
import { ThemeToggle } from "./ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Image as ImageIcon } from "lucide-react"
import { useLang } from "@/store/lang-store"

const BACKGROUND_KEY = "bazhannia-bg-url"

function setBackgroundImageUrl(url: string | null) {
  if (typeof window === "undefined") return
  if (!url) {
    window.localStorage.removeItem(BACKGROUND_KEY)
  } else {
    window.localStorage.setItem(BACKGROUND_KEY, url)
  }
  window.dispatchEvent(new Event("bazhannia:bg-change"))
}

export function Header() {
  const { data: session } = useSession()
  const { t, lang, setLang } = useLang()

  function handleSetBackground() {
    const current = window.localStorage.getItem(BACKGROUND_KEY) ?? ""
    const value = window.prompt(t.backgroundImageUrl, current)
    if (value === null) return
    setBackgroundImageUrl(value.trim() || null)
  }

  return (
    <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4 gap-3">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-bold tracking-tight text-base">{t.appName}</span>
      </div>

      <button
        onClick={() => setLang(lang === "uk" ? "en" : "uk")}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
      >
        {lang === "uk" ? "to ENG" : " to UKR"}
      </button>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full h-9 w-9 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {session?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? "User"}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {session?.user?.name && (
            <div className="px-2 py-1.5 text-sm font-medium truncate">{session.user.name}</div>
          )}
          <DropdownMenuItem onClick={handleSetBackground}>
            <ImageIcon className="h-3.5 w-3.5 mr-2" /> {t.setBackground}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/signin" })}>
            <LogOut className="h-3.5 w-3.5 mr-2" /> {t.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
