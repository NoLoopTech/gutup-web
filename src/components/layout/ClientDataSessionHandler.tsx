"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useMoodStore } from "@/stores/useMoodStore"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import { useStoreStore } from "@/stores/useStoreStore"
import { useRecipeStore } from "@/stores/useRecipeStore"

const ClientDataSessionHandler = (): null => {
  const pathname = usePathname()
  const { resetTranslations } = useMoodStore()
  const { resetTranslations: dailyTipResetTranslations } = useDailyTipStore()
  const { resetForm } = useStoreStore()
  const { resetRecipe } = useRecipeStore()

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
        sessionStorage.removeItem("update-daily-tip-storage")
      }

      // Check if the current path is not '/store-management'
      if (!pathname.includes("/store-management")) {
        resetForm()
        sessionStorage.removeItem("store-store")
      }

      // Check if the current path is not '/food-management/tag-overview/'
      if (!pathname.includes("/food-management/tag-overview/")) {
        sessionStorage.removeItem("tag-store")
      }

      // Check if the current path is not '/food-management/tag-overview/'
      if (!pathname.includes("/recipe-management/")) {
        resetRecipe()
        sessionStorage.removeItem("recipe-storage")
        sessionStorage.removeItem("update-recipe-storage")
      }
    }

    void handleCheckPath()
  }, [pathname, resetTranslations, dailyTipResetTranslations, resetForm])

  return null
}

export default ClientDataSessionHandler
