import type { Recipe } from '@/types/recipe.types'
import type { RecipeDraft } from './llm.service'
import api from './api'

export class RecipeService {
  static async getRecipes(): Promise<Recipe[]> {
    const response = await api.get('/recipes')
    // API returns { recipes: [...] }
    return response.data.recipes || response.data
  }

  static async getRecipeById(id: string): Promise<Recipe> {
    const response = await api.get(`/recipes/${id}`)
    // Backend returns { recipe: {...} }, so extract the recipe object
    return response.data.recipe || response.data
  }

  static async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Recipe> {
    const response = await api.post('/recipes', recipe)
    // Backend returns { recipe: {...} }, so extract the recipe object
    return response.data.recipe || response.data
  }

  // Convert a recipe draft to a real recipe (triggers embedding generation and database save)
  static async createRecipeFromDraft(draft: RecipeDraft): Promise<Recipe> {
    // Transform draft to recipe format expected by the API
    const recipeData = {
      name: draft.name,
      description: draft.description,
      category: draft.category,
      cuisine: '', // Default value - could be extracted from draft or set separately
      ingredients: draft.ingredients,
      instructions: draft.instructions,
      calories: draft.calories,
      protein: draft.protein,
      carbs: draft.carbs,
      fat: draft.fat,
      dietary_preferences: [], // Default - could be inferred from recipe content
      tags: []
    }
    
    return this.createRecipe(recipeData)
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