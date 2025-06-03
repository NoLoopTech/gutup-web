import { getServerSession } from "next-auth/next"
import React from "react"
import { authOptions } from "@/app/(client)/api/auth/[...nextauth]/route"

export default async function Protected (): Promise<any> {
  const session = await getServerSession(authOptions)

  return (
    <div className='grid grid-cols-2 text-white p-4'>
      <div>
        <h1 className='leading-loose text-[15rem] font-extrabold text-accent'>
          Hi {session?.user.name}!
        </h1>
      </div>
      <div>
        <p>Protected page</p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  )
}
