"use client"

import { useEffect, useState } from "react"

export function useCurrentLocale(defaultLocale: string = "en"): string {
  const [locale, setLocale] = useState(defaultLocale)

  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/i18next=([^;]+)/)
      setLocale(match ? match[1] : defaultLocale)
    }
  }, [defaultLocale])

  return locale
}
