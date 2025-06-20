import axiosInstance from "@/query/axios.instance"

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
