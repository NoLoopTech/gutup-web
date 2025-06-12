import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import FoodOverviewPage from "../partials/FoodOverviewPage"

export const metadata = {
  title: "Food Management"
}

export default async function FoodOverview(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <FoodOverviewPage />
}
