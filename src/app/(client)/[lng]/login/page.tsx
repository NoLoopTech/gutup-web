import { getServerSession } from "next-auth"
import LoginForm from "./partials/LoginForm"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"

export default async function Login({
  searchParams
}: {
  searchParams: Record<"status", string | string[] | undefined>
}): Promise<any> {
  const status = searchParams.status
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return <LoginForm />
}
