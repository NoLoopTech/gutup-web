import type { AuthResponse } from "@/models/user"

export async function authenticate (email: string, password: string): Promise<AuthResponse | undefined> {
  const res = await fetch(`${process.env.API_URL as string}api/auth/login`, {
    cache: 'no-store',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: (new URLSearchParams({
      email,
      password
    })).toString()
  })
  if (res.status === 200) {
    // auth success
    return await res.json()
  } else {
    return undefined
  }
}
