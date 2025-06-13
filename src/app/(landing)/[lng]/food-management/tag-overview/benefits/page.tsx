import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import FoodsBenefitsPage from "../partials/FoodsBenefitsPage"

export default async function TagBenefits(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <FoodsBenefitsPage />
}
