import { authenticate } from "@/services/authService"
import Cookie from "@/services/cookieService"
import { NextResponse } from "next/server"

export async function POST (req: Request): Promise<NextResponse> {
  const redirectUrl = new URL('/login', req.url)

  const formData = await req.formData()
  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null

  if (email !== null && password !== null) {
    try {
      const authResponse = await authenticate(email, password)

      if (typeof authResponse !== "undefined") {
        redirectUrl.searchParams.set('status', 'success')

        const res = NextResponse.redirect(redirectUrl, 303) // https://github.com/vercel/next.js/issues/32424#issuecomment-992991313
        Cookie.setSecure(res, 'token', authResponse.token)
        Cookie.setReadable(res, 'user', JSON.stringify(authResponse.user))

        return res
      } else {
        // fall through to error response
      }
    } catch (e) {
      console.log(e)
    }
  }
  redirectUrl.searchParams.set('status', 'authentication failed')
  return NextResponse.redirect(redirectUrl, 303) // explicitly redirect as a GET request
}
