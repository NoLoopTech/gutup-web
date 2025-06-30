import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import DailyTipsPage from "./partials/DailyTipsPage"

export default async function DailyTips(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <DailyTipsPage token={session.apiToken} />
}
