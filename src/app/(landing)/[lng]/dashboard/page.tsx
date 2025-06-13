import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import DashboardPage from "./partials/DashboardPage"

export const metadata = {
  title: "Dashboard"
}

export default async function Dashboard(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  redirect("/user-management")
}

// The dashboard is currently unavailable.
