"use client"

import { SessionProvider } from "next-auth/react"

interface Props {
  children: React.ReactNode
}

export default function NextAuthProvider({ children }: Props): React.ReactNode {
  return <SessionProvider>{children}</SessionProvider>
}
