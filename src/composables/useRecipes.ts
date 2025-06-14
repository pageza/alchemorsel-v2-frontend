import { computed, onMounted } from 'vue'
import { useRecipeStore } from '@/stores/recipe.store'

/**
 * Composable for fetching and reacting to recipe data.
 */
export function useRecipes() {
  const store = useRecipeStore()
  const recipes = computed(() => store.recipes)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  function fetchRecipes() {
    return store.fetchRecipes()
  }

  function fetchRecipeById(id: string) {
    return store.fetchRecipeById(id)
  }

  function toggleFavorite(id: string) {
    return store.toggleFavorite(id)
  }

  onMounted(() => {
    fetchRecipes()
  })

  return {
    recipes,
    isLoading,
    error,
    fetchRecipes,
    fetchRecipeById,
    toggleFavorite,
    /**
     * Get a recipe from cache by ID (must be fetched first).
     */
    getRecipeById: (id: string) => store.getRecipeById(id),
  }
}