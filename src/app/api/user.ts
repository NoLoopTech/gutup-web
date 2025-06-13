import axiosInstance from "@/query/axios.instance"

// get all users
export const getAllUsers = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/v1/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// get user by id (for user overview)
export const getUserById = async (token: string, id: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/v1/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
