import type { AuthResponse } from "@/models/user"

export async function authenticate(
  email: string,
  password: string
): Promise<AuthResponse | undefined> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}v1/auth/login`,
    {
      cache: "no-store",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  )
  if (res.status === 200 || res.status === 201) {
    // auth success
    return await res.json()
  } else {
    return undefined
  }
}
