"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useMoodStore } from "@/stores/useMoodStore"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import { useStoreStore } from "@/stores/useStoreStore"

const ClientSessionHandler = (): null => {
  const pathname = usePathname()
  const { resetTranslations } = useMoodStore()
  const { resetTranslations: dailyTipResetTranslations } = useDailyTipStore()
  const { resetForm } = useStoreStore()

  useEffect(() => {
    const handleCheckPath = async (): Promise<void> => {
      // Check if the current path is not '/content-management/moods/'
      if (pathname !== "/content-management/moods/") {
        resetTranslations()
        sessionStorage.removeItem("mood-storage")
        sessionStorage.removeItem("updated-mood-fields")
      }

      // Check if the current path is not '/content-management/daily-tips/'
      if (pathname !== "/content-management/daily-tips/") {
        dailyTipResetTranslations()
        sessionStorage.removeItem("daily-tip-storage")
      }

      // Check if the current path is not '/store-management'
      if (!pathname.includes("/store-management")) {
        resetForm()
        sessionStorage.removeItem("store-store")
      }
    }

    void handleCheckPath()
  }, [pathname, resetTranslations, dailyTipResetTranslations, resetForm])

  return null
}

export default ClientSessionHandler
