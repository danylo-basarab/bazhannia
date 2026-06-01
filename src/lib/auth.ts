import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { randomBytes } from "crypto"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 365 * 24 * 60 * 60 },
  pages: { signIn: "/signin" },
  providers: [
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {
        name: { label: "Name", type: "text" },
        guestToken: { label: "Guest Token", type: "text" },
      },
      async authorize(credentials) {
        const guestToken = credentials?.guestToken?.trim()
        const name = credentials?.name?.trim() || "Guest"

        if (guestToken) {
          const existing = await prisma.user.findUnique({ where: { guestToken } })
          if (existing) return { id: existing.id, name: existing.name, guestToken: existing.guestToken }
        }

        const newToken = randomBytes(32).toString("hex")
        const user = await prisma.user.create({
          data: { name, isGuest: true, guestToken: newToken },
        })
        return { id: user.id, name: user.name, guestToken: user.guestToken }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.guestToken = user.guestToken ?? undefined
      }
      return token
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId
      if (token.guestToken) session.user.guestToken = token.guestToken
      return session
    },
  },
}
