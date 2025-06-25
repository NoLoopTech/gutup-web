import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import UserManagementPage from "./partials/UserManagementPage"

export const metadata = {
  title: "User Management"
}

export default async function UserManagement(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <UserManagementPage token={session.apiToken} />
}
