"use client"

import { Input } from "@/components/ui/input"
import { useTranslation } from "@/query/hooks/useTranslation"
import React, { useState, useEffect } from "react"

export default function Page() {
  const [englishText, setEnglishText] = useState("")
  const { translatedText, translateText, loading, error } = useTranslation()

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (englishText) {
        translateText(englishText)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [englishText, translateText])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnglishText(e.target.value)
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter English"
        value={englishText}
        onChange={handleChange}
      />
      {loading && <p>Loading...</p>}
      <Input placeholder="Convert to French" value={translatedText} disabled />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
