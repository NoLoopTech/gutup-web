// app/content-management/page.tsx
import { redirect } from "next/navigation"

export default function ContentManagementRootPage(): null {
  redirect("/content-management/daily-tips")
  return null
}
