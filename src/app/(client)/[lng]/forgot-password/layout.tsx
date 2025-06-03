import type { ReactNode } from "react"

export default function ForgotPasswordLayout({
  children
}: {
  children: ReactNode
}): React.ReactNode {
  return <div id="forgot-password-layout">{children}</div>
}
