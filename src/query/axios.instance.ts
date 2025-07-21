import axios from "axios"
import type { AxiosInstance } from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})

axiosInstance.interceptors.request.use(
  config => {
    return config
  },
  async error => await Promise.reject(error.response.data)
)

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401 || error.response.status === 403) {
      // Trigger session expired modal
      throw new Error("Session expired")
    }
    throw error.response
  }
)

export default axiosInstance
