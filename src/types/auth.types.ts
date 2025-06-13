export interface User {
  id: string
  email: string
  username: string
  name: string
  profilePictureUrl?: string
  dietaryPreferences: string[]
  allergies: string[]
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  username: string
  dietary_preferences: string[]
  allergies: string[]
}

export interface AuthResponse {
  token: string
} 