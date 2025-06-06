import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Dashboard"
}

export default async function Dashboard(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <h1>Welcome, {session?.user?.name}</h1>
      <p>{session?.user?.role}</p>
      <p>Dashboard Sample content that only logged-in users can see.</p>
    </main>
  )
}
