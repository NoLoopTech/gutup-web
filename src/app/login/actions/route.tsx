import { NextResponse } from "next/server"

export async function GET (request: Request): Promise<NextResponse> {
  const redirectUrl = new URL('/login', request.url)
  redirectUrl.searchParams.set('status', 'failed')

  return NextResponse.redirect(redirectUrl)
}
