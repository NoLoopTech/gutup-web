import type { MiddlewareFactory } from "./stackMiddlewares"
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const withLocaleRedirection: MiddlewareFactory = (
  next: NextMiddleware
) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const res = await next(req, _next)

    const pathname = req.nextUrl.pathname

    // Only redirect route-related paths
    const shouldHandle = pathname.match(
      "/((?!api|_next/static|auth|protected|_next/image|assets|favicon.ico|sw.js).*)"
    )

    if (shouldHandle) {
      // If path doesn't start with /en, redirect to /en
      if (!pathname.startsWith("/en")) {
        return NextResponse.redirect(new URL(`/en${pathname}`, req.url))
      }

      // Optional: Always set cookie to 'en'
      const response = NextResponse.next()
      response.cookies.set("i18next", "en")
      return response
    }

    return res
  }
}
