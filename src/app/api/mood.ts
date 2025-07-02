import axiosInstance from "@/query/axios.instance"
import { AddMoodRequestBody } from "@/types/moodsTypes"

// get all Recipes
export const getAllMoods = async (token: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/mood", {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

export const AddNewMood = async (
  token: string,
  requestBody: AddMoodRequestBody
): Promise<any> => {
  try {
    const response = await axiosInstance.post("/mood", requestBody, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
