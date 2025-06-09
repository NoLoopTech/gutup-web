import type { ReactNode } from "react"

export const metadata = {
  title: "Forgot Password",
  description: "Reset your password!"
}

export default function ForgotPasswordLayout({
  children
}: {
  children: ReactNode
}): React.ReactNode {
  return <div id="forgot-password-layout">{children}</div>
}
