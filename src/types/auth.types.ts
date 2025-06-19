export interface Allergen {
  id: string
  allergen_name: string
  severity: string
}

export interface User {
  id: string
  email: string
  username: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  is_banned?: boolean
  banned_at?: string
  ban_reason?: string
  profile_picture_url?: string
  bio?: string
  privacy_level?: string
  dietary_lifestyles: string[]
  cuisine_preferences: string[]
  allergens: Allergen[]
  email_verified: boolean
  email_verified_at?: string
  created_at: string
  updated_at: string
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
  dietary_lifestyles: string[]
  cuisine_preferences: string[]
  allergies: string[]
}

export interface AuthResponse {
  token: string
  user_id: string
  email_verified?: boolean
} 