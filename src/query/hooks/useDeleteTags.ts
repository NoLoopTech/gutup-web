import { useEffect, useState } from "react"
import { deleteTagById as deleteTagAPI } from "@/app/api/tags"
import { error } from "console"
import { toast } from "sonner"

interface TypesOfFoodsDataType {
  tagId: number
  category: string
  count: string
  status: boolean
}

interface FoodsBenefitsDataType {
  tagId: number
  category: string
  count: string
  status: boolean
}

export function useDeleteTag(token: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // const [success, setSuccess] = useState(false)

  const deleteTag = async (id: number) => {
    setLoading(true)
    setError(null)
    //    setSuccess(false)

    try {
      const response = await deleteTagAPI(token, id)
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
      const message = "Error deleting tag"
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }
  return { deleteTag, loading, error }
}
