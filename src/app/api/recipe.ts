import axiosInstance from "@/query/axios.instance"

// get all Recipes
export const getAllRecipes = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/recipe/admin", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// get recipe by id (for recipe overview)
export const getRecipeById = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/recipe/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
