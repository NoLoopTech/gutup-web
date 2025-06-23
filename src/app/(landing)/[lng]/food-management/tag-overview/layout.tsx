// app/content-management/layout.tsx
import Link from "next/link"
import type { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Food Management"
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
      <Tabs defaultValue="food-types" className="mb-4 ">
        <TabsList className="h-10">
          <Link href="/food-management/tag-overview/food-types" passHref>
            <TabsTrigger value="food-types" className="h-[34px]">
              Types of Food
            </TabsTrigger>
          </Link>
          <Link href="/food-management/tag-overview/benefits" passHref>
            <TabsTrigger value="benefits" className="h-[34px]">
              Benefits
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {/* content  */}
      {children}
    </main>
  )
}
