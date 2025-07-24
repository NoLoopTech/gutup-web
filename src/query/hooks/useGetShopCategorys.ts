import { useEffect, useState } from "react"
import { getStoreCategories } from "@/app/api/store"

export function useGetShopCategorys<T>() {
  const [shopCategorys, setShopCategorys] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShopCategorys = async () => {
    try {
      const response = await getStoreCategories()
      if (response.status === 200) {
        setShopCategorys(response.data)
      } else {
        setError("Failed to fetch")
      }
    } catch (err) {
      setError("Error fetching shop categorys")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShopCategorys()
  }, [])

  return { shopCategorys, loading, error, fetchShopCategorys }
}
