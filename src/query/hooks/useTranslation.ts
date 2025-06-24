import { useCallback, useState } from "react"
import axios from "axios"

export function useTranslation() {
  const [translatedText, setTranslatedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const translateText = useCallback(async (text: string) => {
    if (!text.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/translate", { text })

      if (response.data.translated) {
        setTranslatedText(response.data.translated)
      } else {
        setError("Translation failed, please try again.")
        setTranslatedText("")
      }
    } catch (err) {
      console.error("Translation request failed", err)
      setError("Something went wrong. Please try again later.")
      setTranslatedText("")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    translatedText,
    translateText,
    loading,
    error
  }
}
