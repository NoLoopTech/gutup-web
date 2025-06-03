"use client"

import { useSession } from "next-auth/react"
import React, { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"

import rtkQueryClient from "@/query"

import TestQuerySection from "./partials/TestQuerySection"
import TestMutationSection from "./partials/TestMutationSection"

export default function ClientSideRoot(): React.ReactNode {
  const { data: session } = useSession()

  const [shown, setShown] = useState<boolean>(false)
  const clickHandler = (): void => {
    setShown(!shown)
  }

  return (
    <div className="grid grid-cols-2 text-white p-4">
      <div>
        <h1 className="leading-loose text-[5rem] font-extrabold text-accent">
          Hi {session?.user.fullname}!
        </h1>
      </div>
      <QueryClientProvider client={rtkQueryClient}>
        <TestQuerySection />
        <TestMutationSection />
      </QueryClientProvider>
      <div>
        <p>Protected client page</p>
        <button className="btn btn-primary" onClick={clickHandler}>
          Toggle
        </button>
        {shown ? <pre>{JSON.stringify(session, null, 2)}</pre> : null}
      </div>
    </div>
  )
}
