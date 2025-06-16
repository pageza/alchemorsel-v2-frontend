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
  tags: string[]
  calories: number
  protein: number
  carbs: number
  fat: number
  created_at: string
  updated_at: string
  user_id: string
  isFavorite?: boolean
} 