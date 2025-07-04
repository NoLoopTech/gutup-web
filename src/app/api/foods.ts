import axiosInstance from "@/query/axios.instance"
import { NextResponse } from "next/server"

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

// get all tags by category
export const getAllTagsByCategory = async (
  token: string,
  category: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/food/tag-overview/${category}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// POST: Save a new tag
export const AddNewTag = async (
  token: string,
  requestBody: { category: string; tagName: string }
): Promise<any> => {
  try {
    const response = await axiosInstance.post("/food-tag", requestBody, {
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

// delete tag by id
export const deleteTagById = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/food-tag/${id}`, {
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
