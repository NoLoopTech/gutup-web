import axiosInstance from "@/query/axios.instance"

// verify email
export const verifyEmail = async (email: string) => {
  try {
    const response = await axiosInstance.post("/v1/password/request-otp", {
      email
    })
    return response
  } catch (error) {
    return error
  }
}

// verify otp
export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/v1/password/validate-otp", {
      email,
      otp
    })
    return response
  } catch (error) {
    return error
  }
}

// reset password
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const response = await axiosInstance.post("/v1/password/reset", {
      email,
      otp,
      newPassword
    })
    return response
  } catch (error) {
    return error
  }
}
