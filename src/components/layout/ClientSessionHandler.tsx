// components/layout/ClientSessionHandler.tsx

"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useMoodStore } from "@/stores/useMoodStore"
import { useDailyTipStore } from "@/stores/useDailyTipStore"

const ClientSessionHandler = () => {
  const pathname = usePathname()
  const { resetTranslations } = useMoodStore()
  const { resetTranslations: dailyTipResetTranslations } = useDailyTipStore()

  useEffect(() => {
    const handleCheckPath = async () => {
      // Check if the current path is not '/content-management/moods/'
      if (pathname !== "/content-management/moods/") {
        await resetTranslations()
        sessionStorage.removeItem("mood-storage")
      }

      // Check if the current path is not '/content-management/daily-tips/'
      if (pathname !== "/content-management/daily-tips/") {
        await dailyTipResetTranslations()
        sessionStorage.removeItem("daily-tip-storage")
      }
    }

    handleCheckPath()
  }, [pathname])

  return null
}

export default ClientSessionHandler
