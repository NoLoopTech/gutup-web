import "@/app/globals.css"
import "@/styles/typography.css"
import { dir } from "i18next"
import { languages } from "@/i18n/settings"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import NavBase from "@/components/layout/NavBase"
import { AppSidebar } from "@/components/layout/AppSidebar"
import NextAuthProvider from "@/components/layout/NextAuthProvider"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextAuthOptions"
import { redirect } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export async function generateStaticParams(): Promise<
  Array<Record<string, string>>
> {
  return languages.map(lng => ({ lng }))
}

export const metadata = {
  title: {
    default: "GutUp Admin Panel",
    template: "%s | GutUp Admin Panel"
  },
  description: "Welcome to GutUp Admin Panel!"
}

export default async function RootLayout({
  children,
  params: { lng }
}: {
  children: React.ReactNode
  params: { lng: string }
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className}>
        <NextAuthProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-screen">
              {/* Top Navigation Bar */}
              <NavBase />

              {/* contents */}
              <div className="p-4 overflow-y-auto h-[88%]">{children}</div>
            </main>
            <Toaster closeButton className="h-20 " theme="light" />
          </SidebarProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
