"use client"

import { useSession, signOut } from "next-auth/react"
import { ThemeToggle } from "./ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { useLang } from "@/store/lang-store"

export function Header() {
  const { data: session } = useSession()
  const { t, lang, setLang } = useLang()

  return (
    <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4 gap-3">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-bold tracking-tight text-base">{t.appName}</span>
      </div>

      <button
        onClick={() => setLang(lang === "uk" ? "en" : "uk")}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
      >
        {lang === "uk" ? "EN" : "УК"}
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
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/signin" })}>
            <LogOut className="h-3.5 w-3.5 mr-2" /> {t.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
