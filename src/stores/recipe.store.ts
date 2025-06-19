import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe } from '@/types/recipe.types'
import { RecipeService } from '@/services/recipe.service'

export const useRecipeStore = defineStore('recipe', () => {
  // State
  const recipes = ref<Recipe[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const getRecipeById = computed(() => {
    return (id: string) => recipes.value.find(recipe => recipe.id === id)
  })
  
  // Actions
  async function fetchRecipes(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await RecipeService.getRecipes()
      recipes.value = response || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch recipes'
      recipes.value = [] // Ensure it's always an array
    } finally {
      isLoading.value = false
    }
  }
  
  async function searchRecipes(query?: string, category?: string, sortBy?: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await RecipeService.searchRecipes(query, category, sortBy)
      recipes.value = response || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to search recipes'
      recipes.value = [] // Ensure it's always an array
    } finally {
      isLoading.value = false
    }
  }
  
  async function fetchRecipeById(id: string): Promise<Recipe | null> {
    isLoading.value = true
    error.value = null
    try {
      const recipe = await RecipeService.getRecipeById(id)
      // Update the recipe in the list if it exists
      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recipes.value[index] = recipe
      }
      return recipe
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch recipe'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  async function toggleFavorite(recipeId: string, currentStatus?: boolean): Promise<{ is_favorite: boolean; message: string }> {
    try {
      // Find the current recipe to get its favorite status
      const index = recipes.value.findIndex(r => r.id === recipeId)
      const status = currentStatus !== undefined ? currentStatus : (index !== -1 ? recipes.value[index].isFavorite : false)
      
      const result = await RecipeService.toggleFavorite(recipeId, status)
      
      // Update the recipe in the list with the new status
      if (index !== -1) {
        recipes.value[index].isFavorite = result.is_favorite
      }
      
      // Return the result so components can use it
      return result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to toggle favorite'
      throw e
    }
  }
  
  return {
    // State
    recipes,
    isLoading,
    error,
    // Getters
    getRecipeById,
    // Actions
    fetchRecipes,
    searchRecipes,
    fetchRecipeById,
    toggleFavorite
  }
}) 