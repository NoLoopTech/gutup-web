import axiosInstance from "@/query/axios.instance"
import type { CreateFoodDto } from "@/types/foodTypes"

// get all foods
export const getAllFoods = async (
  token: string,
  limit?: number,
  offset?: number
): Promise<any> => {
  try {
    const params: any = {}
    if (limit !== undefined) params.limit = limit
    if (offset !== undefined) params.offset = offset
    const response = await axiosInstance.get("/food", {
      headers: { Authorization: `Bearer ${token}` },
      params
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
    return response // Return the full response with status
  } catch (error: any) {
    // Return a consistent error object
    return {
      error: true,
      status: error?.response?.status || 500,
      data: {
        message:
          error?.response?.data?.message || error.message || "Delete failed"
      }
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

// put food by id
export const putFoodById = async (
  token: string,
  id: number,
  data: CreateFoodDto
): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/food/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
