import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import TypesOfFoodsPage from "../partials/TypesOfFoodsPage"

export default async function TagFoodTypes(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <TypesOfFoodsPage />
    </div>
  )
}
