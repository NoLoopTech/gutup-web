import { useEffect, useState } from "react"
import { getAllTags as fetchTagsAPI } from "@/app/api/foods"

interface TypesOfFoodsDataType {
  category: string
  count: string
  status: boolean
}

interface FoodsBenefitsDataType {
  category: string
  count: string
  status: boolean
}

export function useGetAllTags<T>(token: string, category: string) {
  const [tags, setTags] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || !category) return

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

    fetchTags()
  }, [token, category])

  return { tags, loading, error }
}
