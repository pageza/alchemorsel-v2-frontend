import api from './api'
import type { Recipe } from './recipe.service'

export interface FeaturedRecipesResponse {
  recipes: Recipe[]
  count: number
  category?: string
}

export class FeaturedService {
  static async getFeaturedRecipes(limit = 6): Promise<FeaturedRecipesResponse> {
    const response = await api.get('/featured', {
      params: { limit }
    })
    return response.data
  }

  static async getFeaturedByCategory(category: string, limit = 4): Promise<FeaturedRecipesResponse> {
    const response = await api.get(`/featured/category/${category}`, {
      params: { limit }
    })
    return response.data
  }
}