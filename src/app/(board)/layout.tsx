import { Header } from "@/components/layout/Header"

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
