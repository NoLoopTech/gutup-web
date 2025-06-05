export interface User {
  id: string
  activated: boolean
  email: string
  name: string
  role: string
  apiToken: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  passwordUpdatedAt: string
  iosDeviceToken: string
}

export interface AuthResponse {
  user: User
  access_token: string
  isNewUser: boolean
}
