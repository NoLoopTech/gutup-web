import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import MoodsPage from "./partials/MoodsPage"
import { Button } from "@/components/ui/button"

export default async function Moods(): Promise<any> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <div className="flex justify-end mb-5 -mt-14">
        <Button>Add New</Button>
      </div>
      <MoodsPage />
    </main>
  )
}
