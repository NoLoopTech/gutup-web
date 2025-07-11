import { useEffect, useState } from "react"
import { deleteRecipeById as deleteRecipeAPI } from "@/app/api/recipe"
import { error } from "console"
import { toast } from "sonner"

interface RecipeDataType {
  id: number
  name: string
  category: string
  createdAt: string
  isActive: boolean
  images: string[]
  healthBenefits: string[]
  preparation: string
  rest: string
  persons: number
  ingredients: string[]
}

export function useDeleteRecipe(token: string): {
  deleteRecipe: (id: number) => Promise<{ success: boolean; message: string }>,
  loading: boolean,
  error: string | null
} {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // const [success, setSuccess] = useState(false)

  const deleteRecipe = async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true)
    setError(null)
    //    setSuccess(false)

    try {
      const response = await deleteRecipeAPI(token, id)
      if (response.status === 200 || response.status === 201) {
        //    setSuccess(true)
        return { success: true, message: "Deleted successfully" }
        //   toast.success(response.data.message)
      } else {
        const message = response.data?.message || "Failed to delete"
        setError(message)
        return { success: false, message }
      }
    } catch (err) {
      const message = "Error deleting recipe"
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }
  return { deleteRecipe, loading, error }
}
