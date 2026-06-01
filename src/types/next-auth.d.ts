import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      guestToken: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    guestToken?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    guestToken?: string
  }
}
