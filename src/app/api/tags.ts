import axiosInstance from "@/query/axios.instance"

// get all types
export const getAllTags = async (
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

// get all types by category
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
