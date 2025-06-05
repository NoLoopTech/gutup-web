import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"

export default async function Home(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <h1>Welcome, {session?.user?.name}</h1>
      <p>{session?.user?.role}</p>
      <p>Sample content that only logged-in users can see.</p>
    </main>
  )
}
