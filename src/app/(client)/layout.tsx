import type { JSX } from "react"
import Logo from "@/../public/logo/logo.png"
import "@/app/globals.css"
import NextAuthProvider from "@/components/layout/NextAuthProvider"
import Image from "next/image"
import "@/styles/typography.css"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sign in to GutUp",
  description: "Sign in to GutUp"
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="h-screen grid-cols-2 overflow-y-auto md:grid">
            {/* Left Column */}
            <div className="flex items-center justify-center p-5 bg-Primary-700">
              <Image src={Logo} alt="Logo" width={500} height={400} />
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-center justify-center max-w-[450px] mx-auto px-5 space-y-3 md:space-y-4 py-5">
              {children}
            </div>
          </div>
          <Toaster closeButton className="h-20 " theme="light" />
        </NextAuthProvider>
      </body>
    </html>
  )
}
