import { getServerSession } from "next-auth"

import type { BackendResponse } from "@/models/api"
import { authOptions } from "./nextAuthOptions"

interface ApiCallerParams<TReq> {
  url: string
  method?: "DELETE" | "POST" | "PUT" | "PATCH" | "GET"
  body?: TReq
  headers?: Record<string, string>
  token?: string
  cache?: RequestCache
  includeToken?: boolean
}
const apiCaller = async <TRes, TReq = unknown>({
  url,
  body,
  method = "POST",
  headers,
  token,
  cache = "no-store",
  includeToken = true
}: ApiCallerParams<TReq>): Promise<BackendResponse<TRes>> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

  const headerObj: HeadersInit = {
    "Content-type": "application/json",
    Accept: "application/json",
    ...headers
  }

  if (token) {
    headerObj.Authorization = `Bearer ${token}`
  } else if (includeToken) {
    // INFO: try to get from serverSession
    const session = await getServerSession(authOptions)
    if (session?.apiToken) {
      headerObj.Authorization = `Bearer ${session.apiToken}`
    } else {
      throw new Error("missingToken")
    }
  }

  return await new Promise<BackendResponse<TRes>>((resolve, reject) => {
    fetch(`${BASE_URL}${url}`, {
      headers: headerObj,
      method,
      cache,
      body: body ? JSON.stringify(body) : undefined
    })
      .then(async res => {
        if (!res.ok) {
          reject(await res.json())
        } else {
          resolve(await res.json())
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default apiCaller
