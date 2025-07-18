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

// delete food by id
export const deleteFoodById = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/food/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data // Return only the data, not the whole response
  } catch (error: any) {
    // Return a consistent error object
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || "Delete failed"
    }
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

// post food tag
export const postFoodTag = async (
  token: string,
  data: { tagName: string; tagNameFr: string }
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      "/food-tag",
      {
        category: "Benefit", // always "Benefit"
        tagName: data.tagName,
        tagNameFr: data.tagNameFr
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return response
  } catch (error) {
    return error
  }
}

// patch food by id
export const patchFoodById = async (
  token: string,
  id: number,
  data: CreateFoodDto
): Promise<any> => {
  try {
    const response = await axiosInstance.patch(`/food/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
