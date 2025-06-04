import { authOptions } from "@/lib/nextAuthOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Home(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <h1>Welcome, {session.user?.email}</h1>
      <p>Sample content that only logged-in users can see.</p>
    </main>
  )
}
