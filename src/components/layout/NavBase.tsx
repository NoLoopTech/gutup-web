"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function NavBase(): JSX.Element {
  const pathname = usePathname()

  const routeLabels: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard"
    // Add more as needed
  }

  // Extract route without locale
  const pathWithoutLang = pathname.replace(/^\/(en|de)\b/, "") || "/"
  const label = routeLabels[pathWithoutLang] || ""

  return (
    <header className="flex items-center p-4 space-x-4 border-b">
      <SidebarTrigger className="w-10 h-10" />
      <Separator orientation="vertical" className="h-8" />

      <h3 className="font-medium">{label}</h3>
    </header>
  )
}
