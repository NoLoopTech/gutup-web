import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import StoreManagementPage from "./partials/StoreManagementPage"

export const metadata = {
  title: "Store Management"
}

export default async function StoreManagement(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <StoreManagementPage />
}
