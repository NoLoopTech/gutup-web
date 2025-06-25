import React from "react"

import { useApiQuery } from "@/query"
import type { AuthResponse } from "@/models/user"

export default function TestQuerySection(): React.ReactNode {
  const {
    isLoading: protectedLoading,
    refetch: reloadProtected,
    data: protectedData
  } = useApiQuery<AuthResponse["user"]>(
    ["protected"],
    "auth/protected",
    () => ({
      method: "get",
      params: {
        limit: 10
      }
    })
  )
  const handleTestQueryBtn = (): void => {
    void reloadProtected()
  }

  return (
    <div>
      <p>API Query</p>
      <button className="btn btn-primary" onClick={handleTestQueryBtn}>
        {protectedLoading ? "Loading..." : "Submit"}
      </button>
      <div>{protectedLoading ? "Loading" : protectedData?.name}</div>
    </div>
  )
}
