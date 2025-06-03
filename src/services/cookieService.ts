import type { NextResponse } from "next/server"

const Cookie = {
  /**
   *
   * @param {NextResponse} res - pass the NextResponse instance to set cookies on
   * @param {string} key
   * @param {string} value
   * @param {number} maxAge - ms or Date to expire the cookie in
   * @returns void
   *
   * Sets a secure cookie that is not accessible through JavaScript
   */
  setSecure: (res: NextResponse, key: string, value: string, maxAge?: number | Date): void => {
    res.cookies.set(key, value, {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      expires: maxAge,
      path: '/'
    })
  },
  /**
   *
   * @param {NextResponse} res - pass the NextResponse instance to set cookies on
   * @param {string} key
   * @param {string} value
   * @param {number} maxAge - ms or Date to expire the cookie in
   * @returns void
   *
   * Sets a secure cookie that is accessible through JavaScript
   */
  setReadable: (res: NextResponse, key: string, value: string, maxAge?: number | Date): void => {
    res.cookies.set(key, value, {
      secure: false,
      httpOnly: false,
      sameSite: 'lax',
      expires: maxAge,
      path: '/'
    })
  }
}
export default Cookie
