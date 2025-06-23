// app/content-management/layout.tsx
import Link from "next/link"
import type { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      {/* Tabs with links */}
      <Tabs defaultValue="daily-tips" className="mb-4 ">
        <TabsList className="h-10">
          <Link href="/content-management/daily-tips" passHref>
            <TabsTrigger value="daily-tips" className="h-[34px]">
              Daily Tips
            </TabsTrigger>
          </Link>
          <Link href="/content-management/moods" passHref>
            <TabsTrigger value="moods" className="h-[34px]">
              Moods
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      <div>{children}</div>
    </main>
  )
}
