import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { SessionProvider } from "@/components/providers/SessionProvider"

const nunito = Nunito({ subsets: ["latin", "cyrillic"], variable: "--font-sans", weight: ["300", "400", "500", "600", "700", "800"] })

export const metadata: Metadata = {
  title: "бажання",
  description: "Ваша особиста дошка бажань",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
