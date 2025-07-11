import axiosInstance from "@/query/axios.instance"
import { type AddRecipeRequestBody } from "@/types/recipeTypes"

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

// Add new Recipe
export const addNewRecipe = async (
  token: string,
  requestBody: AddRecipeRequestBody
): Promise<any> => {
  try {
    console.log("check token ", token)
    const response = await axiosInstance.post("/recipe", requestBody, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}


// get all Recipe Clients
export const getAllRecipeClients = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/recipe/client", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// delete recipe by id
export const deleteRecipeById = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/recipe/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
