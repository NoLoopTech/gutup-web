// components/ContentTabs.tsx
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pathToTabValueMap: Record<string, string> = {
  "/en/content-management/daily-tips/": "daily-tips",
  "/en/content-management/moods/": "moods"
}

export default function ContentTabs(): JSX.Element {
  const pathname = usePathname()
  const activeTab = pathToTabValueMap[pathname] || "daily-tips"

  return (
    <Tabs value={activeTab} className="mb-4">
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
  )
}
