import type { ReactNode } from "react"

export default function LoginLayout({
  children
}: {
  children: ReactNode
}): React.ReactNode {
  return <div id="login-layout">{children}</div>
}
