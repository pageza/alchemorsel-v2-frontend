import type { Recipe } from '@/types/recipe.types'
import api from './api'

export class RecipeService {
  static async getRecipes(): Promise<Recipe[]> {
    const response = await api.get('/recipes')
    return response.data
  }

  static async getRecipeById(id: string): Promise<Recipe> {
    const response = await api.get(`/recipes/${id}`)
    return response.data
  }

  static async createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'isFavorite'>): Promise<Recipe> {
    const response = await api.post('/recipes', recipe)
    return response.data
  }

  static async updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
    const response = await api.put(`/recipes/${id}`, recipe)
    return response.data
  }

  static async deleteRecipe(id: string): Promise<void> {
    await api.delete(`/recipes/${id}`)
  }

  static async toggleFavorite(id: string): Promise<void> {
    await api.post(`/recipes/${id}/favorite`)
  }
} 