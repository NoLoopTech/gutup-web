import React from "react"

import apiCaller from "@/lib/apiCaller"
import type { AuthResponse } from "@/models/user"

export default async function Page(): Promise<React.ReactNode> {
  const userData = await apiCaller<
    AuthResponse["user"],
    { iosDeviceToken: string }
  >({
    url: "user/me",
    method: "PATCH",
    body: {
      iosDeviceToken: `server-${Math.random()}`
    }
  })
  return (
    <div className="grid grid-cols-2 text-white p-4">
      <div>
        <h1 className="leading-loose text-[5rem] font-extrabold text-accent">
          Hi {userData.name}!
        </h1>
      </div>
      <div>
        <p>Protected page</p>
        <pre>{userData.iosDeviceToken}</pre>
      </div>
    </div>
  )
}
