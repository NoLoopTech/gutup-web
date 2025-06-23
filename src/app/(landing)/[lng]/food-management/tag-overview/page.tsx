// app/content-management/page.tsx
import { redirect } from "next/navigation"

export default function ContentManagementRootPage(): null {
  redirect("/food-management/tag-overview/food-types")
  return null
}
