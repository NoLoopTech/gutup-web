import { useCallback, useState } from "react"
import axios from "axios"

export function useTranslation() {
  const [translatedText, setTranslatedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const translateText = useCallback(async (text: string): Promise<string> => {
    if (!text.trim()) return ""

    setLoading(true)
    setError("")
    let result = ""

    try {
      const response = await axios.post("/api/translate", { text })

      if (response.data.translated) {
        result = response.data.translated
        setTranslatedText(result)
      } else {
        setError("Translation failed, please try again.")
      }
    } catch (err) {
      console.error("Translation request failed", err)
      setError("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }

    return result
  }, [])

  return {
    translatedText,
    translateText,
    loading,
    error
  }
}
