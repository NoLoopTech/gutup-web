import type { ReactNode } from "react"

export const metadata = {
  title: "Sign in to GutUp",
  description: "Sign in to GutUp!"
}

export default function LoginLayout({
  children
}: {
  children: ReactNode
}): React.ReactNode {
  return <div id="login-layout">{children}</div>
}
