import axiosInstance from "@/query/axios.instance"
import { AddDailyTipTypes, EditDailyTipTypes } from "@/types/dailyTipTypes"

// get all Recipes
export const getAllDailyTips = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/daily-tips", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

export const AddNewDailyTips = async (
  token: string,
  requestBody: AddDailyTipTypes
): Promise<any> => {
  try {
    const response = await axiosInstance.post("/daily-tips", requestBody, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// get daily tip by daily tip id
export const getDailyTipById = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/daily-tips/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// update daily tip by id
export const updateDailyTip = async (
  token: string,
  id: number,
  requestBody: EditDailyTipTypes
): Promise<any> => {
  try {
    const response = await axiosInstance.patch(
      `/daily-tips/${id}`,
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

// delete daily tip by id
export const deleteDailyTipById = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/daily-tips/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
