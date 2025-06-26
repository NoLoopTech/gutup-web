import { useEffect, useState } from "react"
import { getAllTags as fetchTagsAPI } from "@/app/api/foods"

interface TypesOfFoodsDataType {
  category: string
  count: string
  status: boolean
}

export function useGetAllTags(token: string) {
  const [tags, setTags] = useState<TypesOfFoodsDataType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchTags = async () => {
      try {
        const response = await fetchTagsAPI(token)
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
  }, [token])

  return { tags, loading, error }
}
