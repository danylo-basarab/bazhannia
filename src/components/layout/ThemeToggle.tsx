"use client"

import { Moon, Sun, Check } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLang } from "@/store/lang-store"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useLang()
  const current = (theme as "light" | "dark") ?? "light"

  const themes = [
    { id: "light" as const, label: t.themeLight, Icon: Sun },
    { id: "dark" as const, label: t.themeDark, Icon: Moon },
  ]

  const CurrentIcon = current === "dark" ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full h-9 w-9 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <CurrentIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themes.map(({ id, label, Icon }) => (
          <DropdownMenuItem key={id} onClick={() => setTheme(id)} className="gap-2">
            <Icon className="h-3.5 w-3.5" />
            {label}
            {current === id && <Check className="h-3.5 w-3.5 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
