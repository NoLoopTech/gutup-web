import axiosInstance from "@/query/axios.instance"
import type { CreateFoodDto } from "@/types/foodTypes"

// get all foods
export const getAllFoods = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/food", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// get foods by id
export const getFoodsById = async (token: string, id: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/food/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// delete user by id
export const deleteFoodById = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/food/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// get all food list for search and select
export const getAllFoodsList = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/food/foodlist", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// post new food
export const postNewFood = async (
  token: string,
  data: CreateFoodDto
): Promise<any> => {
  try {
    const response = await axiosInstance.post("/food", data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log("Token being sent:", token)
    return response
  } catch (error) {
    return error
  }
}

// get category food type and benifit
export const getCatagoryFoodType = async (
  token: string,
  category: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/food-tag/category/${category}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
