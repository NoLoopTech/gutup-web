// app/content-management/layout.tsx
import type { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import ContentTabs from "./partials/ContentTabs"

export const metadata = {
  title: "Content Management"
}

export default async function Layout({
  children
}: {
  children: ReactNode
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <main>
      <ContentTabs />

      <div>{children}</div>
    </main>
  )
}
