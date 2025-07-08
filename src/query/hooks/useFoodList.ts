// hooks/useFoodList.ts
import { getAllFoodsList } from "@/app/api/foods"
import { useEffect, useState } from "react"

export const useFoodList = (token: string) => {
  const [foods, setFoods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchFoods = async () => {
      if (!token) {
        setError(new Error("No token found"))
        setLoading(false)
        return
      }

      try {
        const foodList = await getAllFoodsList(token)
        setFoods(foodList.data)
        console.log("Fetched foods:", foodList.data)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFoods()
  }, [])

  return { foods, loading, error }
}
