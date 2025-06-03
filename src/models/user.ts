export interface User {
  id: string
  username: string
  email: string
  fullname: string
  role: string
  createdAt: string
  name: string
  apiToken: string
}

export interface AuthResponse {
  user: User
  token: string
  status: 200
}
