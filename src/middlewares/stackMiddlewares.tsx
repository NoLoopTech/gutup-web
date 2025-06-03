/**
 * Utility function to stack middleware adapted from
 * https://reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs
 */
import { NextResponse } from "next/server"
import type { NextMiddleware } from "next/server"

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

export default function stackMiddlewares (
  functions: MiddlewareFactory[] = [],
  index = 0
): NextMiddleware {
  const current = functions[index]
  if (typeof current !== 'undefined') {
    const next = stackMiddlewares(functions, index + 1)
    return current(next)
  }
  return () => NextResponse.next()
}
