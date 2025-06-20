import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RateLimitService, type RateLimitStatus } from '@/services/rate-limit.service'

export function useRateLimit() {
  const recipeCreationLimit = ref<RateLimitStatus | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  let refreshInterval: number | null = null

  // Computed properties for recipe creation
  const canCreateRecipe = computed(() => {
    if (!recipeCreationLimit.value) return true
    return recipeCreationLimit.value.remaining > 0
  })

  const creationUsagePercentage = computed(() => {
    if (!recipeCreationLimit.value) return 0
    return RateLimitService.getUsagePercentage(recipeCreationLimit.value)
  })

  const creationResetTimeFormatted = computed(() => {
    if (!recipeCreationLimit.value) return ''
    return RateLimitService.formatResetTime(recipeCreationLimit.value.reset_time)
  })

  // Fetch recipe creation rate limit
  const fetchRecipeCreationLimit = async () => {
    try {
      isLoading.value = true
      error.value = null
      recipeCreationLimit.value = await RateLimitService.getRecipeCreationLimit()
    } catch (err) {
      error.value = 'Failed to load rate limit information'
      console.error('Rate limit fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Start auto-refresh of rate limit data
  const startAutoRefresh = (intervalMs = 30000) => {
    if (refreshInterval) return
    
    refreshInterval = window.setInterval(() => {
      fetchRecipeCreationLimit()
    }, intervalMs)
  }

  // Stop auto-refresh
  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Initialize
  onMounted(() => {
    fetchRecipeCreationLimit()
    startAutoRefresh()
  })

  // Cleanup
  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    // State
    recipeCreationLimit: computed(() => recipeCreationLimit.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Computed properties
    canCreateRecipe,
    creationUsagePercentage,
    creationResetTimeFormatted,
    
    // Methods
    fetchRecipeCreationLimit,
    startAutoRefresh,
    stopAutoRefresh,
  }
}

export function useRecipeModificationRateLimit(recipeId: string) {
  const modificationLimit = ref<RateLimitStatus | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties for recipe modification
  const canModifyRecipe = computed(() => {
    if (!modificationLimit.value) return true
    return modificationLimit.value.remaining > 0
  })

  const modificationUsagePercentage = computed(() => {
    if (!modificationLimit.value) return 0
    return RateLimitService.getUsagePercentage(modificationLimit.value)
  })

  const modificationResetTimeFormatted = computed(() => {
    if (!modificationLimit.value) return ''
    return RateLimitService.formatResetTime(modificationLimit.value.reset_time)
  })

  // Fetch recipe modification rate limit
  const fetchRecipeModificationLimit = async () => {
    if (!recipeId) return
    
    try {
      isLoading.value = true
      error.value = null
      modificationLimit.value = await RateLimitService.getRecipeModificationLimit(recipeId)
    } catch (err) {
      error.value = 'Failed to load modification rate limit'
      console.error('Recipe modification rate limit error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    modificationLimit: computed(() => modificationLimit.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Computed properties
    canModifyRecipe,
    modificationUsagePercentage,
    modificationResetTimeFormatted,
    
    // Methods
    fetchRecipeModificationLimit,
  }
}