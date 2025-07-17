import axiosInstance from "@/query/axios.instance"
import { AddDailyTipTypes } from "@/types/dailyTipTypes"

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
