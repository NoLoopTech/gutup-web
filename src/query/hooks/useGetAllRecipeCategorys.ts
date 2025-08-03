import { fetchRecipeCategoryAPI } from "@/app/api/recipe"
import { useEffect, useState } from "react"

export function useGetAllRecipeCategorys<T>(): {
  recipeCategory: T[]
  loading: boolean
  error: string | null
  fetchRecipeCategory: () => Promise<void>
} {
  const [recipeCategory, setRecipeCategory] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipeCategory = async (): Promise<void> => {
    try {
      const response = await fetchRecipeCategoryAPI()
      if (response.status === 200) {
        setRecipeCategory(response.data)
      } else {
        setError("Failed to fetch")
      }
    } catch (err) {
      setError("Error fetching recipe category")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchRecipeCategory()
  }, [])

  return { recipeCategory, loading, error, fetchRecipeCategory }
}
