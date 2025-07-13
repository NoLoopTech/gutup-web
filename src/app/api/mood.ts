import axiosInstance from "@/query/axios.instance"
import { AddMoodRequestBody } from "@/types/moodsTypes"

// get all mood
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

// add mood
export const addNewMood = async (
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

// get mood by mood id
export const getMoodById = async (token: string, id: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/mood/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}

// update mood by id
export const updateNewMood = async (
  token: string,
  moodId: number,
  requestBody: AddMoodRequestBody
): Promise<any> => {
  try {
    const response = await axiosInstance.patch(`/mood/${moodId}`, requestBody, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response
  } catch (error) {
    return error
  }
}
