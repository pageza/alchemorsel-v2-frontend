export interface RecipeAuthor {
  id: string
  username: string
  name: string
  profile_picture_url?: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  image_url?: string
  ingredients: string[]
  instructions: string[]
  category: string
  cuisine: string
  dietary_preferences: string[]
  dietary_tags?: string[]  // Legacy field for compatibility
  tags: string[]
  prep_time?: number
  cook_time?: number
  servings?: number
  difficulty?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  created_at: string
  updated_at: string
  user_id: string
  isFavorite?: boolean
  author?: RecipeAuthor
  // Admin fields
  is_hidden?: boolean
  moderation_reason?: string
  user?: {
    id: string
    name: string
    email: string
  }
} 