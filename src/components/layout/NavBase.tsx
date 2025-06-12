"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ChevronRight } from "lucide-react"

export default function NavBase(): JSX.Element {
  const pathname = usePathname()

  const routeLabels: Record<string, string> = {
    "/dashboard/": "Dashboard",
    "/user-management/": "User Management",
    "/food-management/food-overview/": "Food Management > Food Overview",
    "/food-management/tag-overview/": "Food Management > Tag Overview",
    "/recipe-management/": "Recipe Management",
    "/store-management/": "Store Management",
    "/content-management/daily-tips/": "Content Management > Daily Tips",
    "/content-management/moods/": "Content Management > Moods"
  }

  const pathWithoutLang = pathname.replace(/^\/(en|de)\b/, "") || "/"
  const label = routeLabels[pathWithoutLang] || ""

  // Split the label on " > " and insert icons
  const labelParts = label.split(" > ")

  return (
    <header className="flex items-center p-4 space-x-4 border-b">
      <SidebarTrigger className="w-10 h-10" />
      <Separator orientation="vertical" className="h-8" />

      <h3 className="flex items-center space-x-1 font-medium">
        {labelParts.map((part, index) => (
          <span key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-5 h-5 mx-1 text-muted-foreground" />
            )}
            <span>{part}</span>
          </span>
        ))}
      </h3>
    </header>
  )
}
