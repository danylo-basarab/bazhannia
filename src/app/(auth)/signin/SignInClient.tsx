"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useLang } from "@/store/lang-store"

type Tab = "login" | "register"

export function SignInClient() {
  const { t, lang, setLang } = useLang()
  const [tab, setTab] = useState<Tab>("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [registrationCode, setRegistrationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn("credentials", {
      username: username.trim(),
      password,
      callbackUrl: "/board",
      redirect: false,
    })
    if (res?.error) {
      setError(lang === "uk" ? "Невірне ім'я або пароль" : "Invalid username or password")
      setLoading(false)
    } else {
      window.location.href = "/board"
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password.length < 6) {
      setError(t.passwordMinLength)
      return
    }
    setLoading(true)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password, registrationCode }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }
    await signIn("credentials", { username: username.trim(), password, callbackUrl: "/board" })
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

        <div className="flex rounded-2xl bg-muted p-1 gap-1">
          {(["login", "register"] as Tab[]).map((t2) => (
            <button
              key={t2}
              type="button"
              onClick={() => { setTab(t2); setError("") }}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${
                tab === t2 ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t2 === "login" ? t.loginTab : t.registerTab}
            </button>
          ))}
        </div>

        <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">{t.usernameLabel}</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.usernamePlaceholder}
              className="h-11 rounded-2xl"
              autoFocus
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="h-11 rounded-2xl"
              required
            />
          </div>

          {tab === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="registration-code">{t.registrationCodeLabel}</Label>
              <Input
                id="registration-code"
                type="password"
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                placeholder={t.registrationCodePlaceholder}
                className="h-11 rounded-2xl"
                required
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full h-11 rounded-2xl font-medium" disabled={loading}>
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : tab === "login" ? t.loginButton : t.registerButton
            }
          </Button>
        </form>
      </div>
    </div>
  )
}
