import axiosInstance from "@/query/axios.instance"
import { NavigationSearchResponse } from "@/types/dailyTipTypes"

// Backend response item format
interface BackendNavigationItem {
  id: number
  type: "recipe" | "food" | "store"
  nameEN: string
  nameFR: string
}

/**
 * Search for navigation targets (recipes, foods, stores)
 * @param token - Authentication token
 * @param query - Search query string
 * @returns Navigation search results grouped by type
 */
export const searchNavigation = async (
  token: string,
  query: string
): Promise<NavigationSearchResponse> => {
  try {
    // Backend endpoint: /daily-tips/navigation/search?q=keyword
    const response = await axiosInstance.get<BackendNavigationItem[]>(
      `/daily-tips/navigation/search`,
      {
        params: { q: query },
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    // Transform flat array to grouped format expected by frontend
    const items = response.data || []
    const recipes = items
      .filter(item => item.type === "recipe")
      .map(item => ({
        type: "recipe" as const,
        id: item.id,
        name: item.nameEN,
        nameFR: item.nameFR
      }))
    const foods = items
      .filter(item => item.type === "food")
      .map(item => ({
        type: "food" as const,
        id: item.id,
        name: item.nameEN,
        nameFR: item.nameFR
      }))
    const stores = items
      .filter(item => item.type === "store")
      .map(item => ({
        type: "store" as const,
        id: item.id,
        name: item.nameEN,
        nameFR: item.nameFR
      }))

    return {
      recipes,
      foods,
      stores,
      total: items.length
    }
  } catch (error: any) {
    // If the endpoint doesn't exist yet, return empty results
    if (error?.response?.status === 404) {
      return {
        recipes: [],
        foods: [],
        stores: [],
        total: 0
      }
    }
    throw error
  }
}

/**
 * Search recipes by keyword
 * @param token - Authentication token
 * @param keyword - Search keyword
 * @returns Array of recipes matching the keyword
 */
export const searchRecipes = async (
  token: string,
  keyword: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/recipe/filter`, {
      params: { searchTerm: keyword, limit: 20 },
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    return { data: [] }
  }
}

/**
 * Search foods by keyword
 * @param token - Authentication token
 * @param keyword - Search keyword
 * @returns Array of foods matching the keyword
 */
export const searchFoods = async (
  token: string,
  keyword: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/food/filter`, {
      params: { searchTerm: keyword, limit: 20 },
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    return { data: [] }
  }
}

/**
 * Search stores by keyword
 * @param token - Authentication token
 * @param keyword - Search keyword
 * @returns Array of stores matching the keyword
 */
export const searchStores = async (
  token: string,
  keyword: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/store/user/search/${keyword}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    return { data: [] }
  }
}
