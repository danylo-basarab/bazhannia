import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Lang } from "@/lib/i18n"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined, lang: Lang = "en"): string {
  if (price == null) return ""

  const formatted = new Intl.NumberFormat(lang === "uk" ? "uk-UA" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)

  return lang === "uk" ? `${formatted} грн` : `${formatted} UAH`
}

export function categoryColor(category: string | null | undefined): string {
  if (!category) return "hsl(220 14% 90%)"
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 60% 88%)`
}

export function categoryTextColor(category: string | null | undefined): string {
  if (!category) return "hsl(220 14% 40%)"
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 50% 35%)`
}
