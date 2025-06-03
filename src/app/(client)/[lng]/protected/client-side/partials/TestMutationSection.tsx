import React from "react"

import { useApiMutation } from "@/query"
import type { AuthResponse } from "@/models/user"

export default function TestMutationSection(): React.ReactNode {
  const {
    isPending: userUpdating,
    mutate: mutateProtected,
    data: userData
  } = useApiMutation<AuthResponse["user"], { iosDeviceToken: string }>(
    "user/me",
    "patch"
  )
  const handleTestQueryBtn = (): void => {
    mutateProtected({ iosDeviceToken: `aoed-${Math.random()}` })
  }

  return (
    <div>
      <p>API Mutation</p>
      <button className="btn btn-primary" onClick={handleTestQueryBtn}>
        {userUpdating ? "Updating..." : "Update"}
      </button>
      <div>{userUpdating ? "Updating" : userData?.iosDeviceToken}</div>
    </div>
  )
}
