import axiosInstance from "@/query/axios.instance"
import type { AddStoreRequestBody } from "@/types/storeTypes"

// get all stores
export const getAllStores = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/store/admin/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

export const AddNewStore = async (
  token: string,
  requestBody: AddStoreRequestBody
): Promise<any> => {
  const response = await axiosInstance.post("/store", requestBody, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response
}
