// Re-export existing types
export * from './auth.types'
export * from './recipe.types'

// Admin types
export interface AdminAction {
  id: string
  admin_id: string
  admin?: User
  action: string
  target_type: string
  target_id?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface PlatformStats {
  total_users: number
  active_users_30d: number
  total_recipes: number
  recipes_today: number
  total_favorites: number
  banned_users: number
}

export interface DailyStats {
  date: string
  new_users: number
  new_recipes: number
  new_favorites: number
}

export interface TopUser {
  user_id: string
  email: string
  username: string
  recipe_count: number
}

// Extend User type with admin fields
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  is_banned: boolean
  banned_at?: string
  ban_reason?: string
  created_at: string
  updated_at: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  user_id: string
  username: string
  profile_picture_url?: string
  bio?: string
  created_at: string
  updated_at: string
}