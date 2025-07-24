import axiosInstance from "@/query/axios.instance"
import type {
  AddStoreRequestBody,
  shopStatusDataType
} from "@/types/storeTypes"

// get store categories
export const getStoreCategories = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("/store-category")
    return response
  } catch (error) {
    return error
  }
}

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

// delete store by id
export const deleteStoreById = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/store/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// get store by id
export const getStoreById = async (token: string, id: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/store/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// get user favorites (foods and recipes) by user id
export const getUserFavorites = async (
  token: string,
  userId: number
): Promise<any> => {
  try {
    const response = await axiosInstance.get(
      `/user-favourite/admin/all/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return response
  } catch (error) {
    return error
  }
}

// update store by id
export const updateStoreById = async (
  token: string,
  storeId: number,
  requestBody: AddStoreRequestBody
): Promise<any> => {
  try {
    const response = await axiosInstance.patch(
      `/store/${storeId}`,
      requestBody,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return response
  } catch (error) {
    return error
  }
}

// update store status by id
export const updateStoreStatusById = async (
  token: string,
  storeId: number,
  shopStatusData: shopStatusDataType
): Promise<any> => {
  try {
    const response = await axiosInstance.patch(
      `/store/${storeId}`,
      { shopStatus: shopStatusData.shopStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return response
  } catch (error) {
    return error
  }
}
