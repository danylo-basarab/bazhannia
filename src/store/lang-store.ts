"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { translations } from "@/lib/i18n"
import type { Lang } from "@/lib/i18n"

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "uk",
      setLang: (lang) => set({ lang }),
    }),
    { name: "wishlist-lang" }
  )
)

export function useLang() {
  const { lang, setLang } = useLangStore()
  return { lang, setLang, t: translations[lang] }
}
