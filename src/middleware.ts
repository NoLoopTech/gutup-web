import { withAuth } from "next-auth/middleware"
import stackMiddlewares from "@/middlewares/stackMiddlewares"
import { withLocaleRedirection } from "./middlewares/withLocaleRedirection"

export default withAuth(
  stackMiddlewares([withLocaleRedirection]),
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (
          req.nextUrl.pathname.startsWith('/protected') &&
          token === null
        ) {
          return false
        }
        return true
      }
    }
  }
)
