import { useEffect, useState } from "react"
import { getAllTagsByCategory as fetchTagsAPI } from "@/app/api/tags"

export function useGetAllTags<T>(token: string, category: string) {
  const [tags, setTags] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = async () => {
    try {
      const response = await fetchTagsAPI(token, category)
      if (response.status === 200) {
        setTags(response.data)
      } else {
        setError("Failed to fetch")
      }
    } catch (err) {
      setError("Error fetching tag")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token || !category) return
    fetchTags()
  }, [token, category])

  return { tags, loading, error, fetchTags }
}
