import { withAuth } from "next-auth/middleware"
import stackMiddlewares from "@/middlewares/stackMiddlewares"
import { withLocaleRedirection } from "./middlewares/withLocaleRedirection"

export default withAuth(stackMiddlewares([withLocaleRedirection]), {
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.includes("/protected") && token === null) {
        return false
      }
      return true
    }
  }
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
    // OR more specific like:
    // "/protected/:path*"
  ]
}
