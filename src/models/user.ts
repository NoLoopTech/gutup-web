export interface User {
  id: number
  username: string
  email: string
  fullname: string
  role: string
  createdAt: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
  status: 200
}
