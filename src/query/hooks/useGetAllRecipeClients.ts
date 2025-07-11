import { useEffect, useState } from "react"
import { getAllRecipeClients as fetchRecipeClientsAPI } from "@/app/api/recipe"


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

export function useGetAllRecipeClients<T>(token: string) {
  const [clients, setClients] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // const fetchRecipeClients = async () => {
  //   try {
  //     const response = await fetchRecipeClientsAPI(token)
  //     console.log("response from recipe clients", response)
  //     if (response.status === 200) {
  //       console.log("response data", response.data)
  //       setClients(response.data)
  //     } else {
  //       setError("Failed to fetch")
  //     }
  //   } catch (err) {
  //     setError("Error fetching tag")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchRecipeClients = async () => {
    try {
      const response = await fetchRecipeClientsAPI(token)
      console.log("response from recipe clients", response)
      if (response.status === 200) {
        // Ensure ingredients is always an array
        const updatedData = response.data.map((clients: RecipeDataType) => ({
          ...clients,
          ingredients: clients.ingredients || [], // Default to empty array if undefined
        }))
        console.log("response data", updatedData)
        setClients(updatedData)
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
    if (!token) return
    fetchRecipeClients()
  }, [token])

  return { clients, loading, error, fetchRecipeClients }
}
