import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import RecipeManagementPage from "./partials/RecipeManagementPage"

export const metadata = {
  title: "Recipe Management"
}

export default async function RecipeManagement(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <RecipeManagementPage token={session.apiToken} />
}
