// components/layout/ClientSessionHandler.tsx

"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useMoodStore } from "@/stores/useMoodStore"

const ClientSessionHandler = () => {
  const pathname = usePathname()
  const { resetTranslations } = useMoodStore()

  useEffect(() => {
    const handleCheckPath = async () => {
      // Check if the current path is not '/content-management/moods/'
      if (pathname !== "/content-management/moods/") {
        await resetTranslations()
        sessionStorage.removeItem("mood-storage")
      }
    }

    handleCheckPath()
  }, [pathname])

  return null
}

export default ClientSessionHandler
