import axiosInstance from "@/query/axios.instance"

// get all stores
export const getAllStores = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/store", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}