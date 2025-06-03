import { getServerSession } from "next-auth/next"
import type { NextRequest } from "next/server"
import React from "react"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function Protected (req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <p>Protected page</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
