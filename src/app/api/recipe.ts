import axiosInstance from "@/query/axios.instance"

// get all users
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
