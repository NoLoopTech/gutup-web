import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import MoodsPage from "../partials/MoodsPage"

export default async function Moods(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <MoodsPage />
}
