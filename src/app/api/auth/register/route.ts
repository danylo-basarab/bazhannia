import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { username, password, registrationCode } = await req.json()

  if (registrationCode !== process.env.REGISTRATION_CODE) {
    return NextResponse.json({ error: "Invalid registration code" }, { status: 403 })
  }

  if (!username?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
  }

  const normalized = username.trim().toLowerCase()
  const existing = await prisma.user.findUnique({ where: { username: normalized } })
  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { username: normalized, name: normalized, password: hashed, isGuest: false },
  })

  return NextResponse.json({ ok: true })
}
