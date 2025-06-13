export interface Recipe {
  id: string
  name: string
  description: string
  imageUrl?: string
  prepTime: number
  cookTime: number
  servings: number
  ingredients: string[]
  instructions: string[]
  category: string
  cuisine: string
  dietaryPreferences: string[]
  tags: string[]
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  userId: string
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
} 