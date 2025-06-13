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
      recipes.value = response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch recipes'
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
  
  async function toggleFavorite(recipeId: string): Promise<void> {
    try {
      await RecipeService.toggleFavorite(recipeId)
      // Update the recipe in the list
      const index = recipes.value.findIndex(r => r.id === recipeId)
      if (index !== -1) {
        recipes.value[index].isFavorite = !recipes.value[index].isFavorite
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to toggle favorite'
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
    fetchRecipeById,
    toggleFavorite
  }
}) 