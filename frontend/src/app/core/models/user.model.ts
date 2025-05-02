export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
  bio?: string
  role: string
  points: number
  level: number
  token?: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  profilePicture?: File
  bio?: string
}
