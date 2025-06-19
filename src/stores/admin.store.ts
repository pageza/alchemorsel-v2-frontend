import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  User, 
  Recipe, 
  AdminAction, 
  PlatformStats,
  DailyStats,
  TopUser 
} from '@/types'
import adminService from '@/services/admin.service'

export const useAdminStore = defineStore('admin', () => {
  // State
  const users = ref<User[]>([])
  const totalUsers = ref(0)
  const currentUserPage = ref(1)
  const userPageSize = ref(20)
  
  const recipes = ref<Recipe[]>([])
  const totalRecipes = ref(0)
  const currentRecipePage = ref(1)
  const recipePageSize = ref(20)
  
  const adminActions = ref<AdminAction[]>([])
  const totalActions = ref(0)
  const currentActionPage = ref(1)
  const actionPageSize = ref(50)
  
  const platformStats = ref<PlatformStats | null>(null)
  const dailyStats = ref<DailyStats[]>([])
  const topUsers = ref<TopUser[]>([])
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // User Management Actions
  async function fetchUsers(page?: number, search?: string) {
    loading.value = true
    error.value = null
    try {
      if (page) currentUserPage.value = page
      const response = await adminService.getUsers(currentUserPage.value, userPageSize.value, search)
      users.value = response.users
      totalUsers.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch users'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getUserDetails(userId: string) {
    loading.value = true
    error.value = null
    try {
      return await adminService.getUserDetails(userId)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch user details'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUserRole(userId: string, role: string) {
    loading.value = true
    error.value = null
    try {
      await adminService.updateUserRole(userId, role)
      // Refresh user list
      await fetchUsers()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update user role'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function banUser(userId: string, reason: string) {
    loading.value = true
    error.value = null
    try {
      await adminService.banUser(userId, reason)
      // Refresh user list
      await fetchUsers()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to ban user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function unbanUser(userId: string) {
    loading.value = true
    error.value = null
    try {
      await adminService.unbanUser(userId)
      // Refresh user list
      await fetchUsers()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to unban user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(userId: string) {
    loading.value = true
    error.value = null
    try {
      await adminService.deleteUser(userId)
      // Refresh user list
      await fetchUsers()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Recipe Moderation Actions
  async function fetchRecipesForModeration(page?: number) {
    loading.value = true
    error.value = null
    try {
      if (page) currentRecipePage.value = page
      const response = await adminService.getRecipesForModeration(currentRecipePage.value, recipePageSize.value)
      recipes.value = response.recipes
      totalRecipes.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch recipes'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function hideRecipe(recipeId: string, reason?: string) {
    loading.value = true
    error.value = null
    try {
      await adminService.hideRecipe(recipeId, reason)
      // Refresh recipe list
      await fetchRecipesForModeration()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to hide recipe'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function unhideRecipe(recipeId: string) {
    loading.value = true
    error.value = null
    try {
      await adminService.unhideRecipe(recipeId)
      // Refresh recipe list
      await fetchRecipesForModeration()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to unhide recipe'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRecipe(recipeId: string) {
    loading.value = true
    error.value = null
    try {
      await adminService.deleteRecipe(recipeId)
      // Refresh recipe list
      await fetchRecipesForModeration()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete recipe'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Analytics Actions
  async function fetchPlatformStats() {
    loading.value = true
    error.value = null
    try {
      platformStats.value = await adminService.getPlatformStats()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch platform stats'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDailyStats(days = 30) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.getDailyStats(days)
      dailyStats.value = response.stats
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch daily stats'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTopUsers(limit = 10) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.getTopUsers(limit)
      topUsers.value = response.users
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch top users'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Admin Actions Log
  async function fetchAdminActions(page?: number, filters?: any) {
    loading.value = true
    error.value = null
    try {
      if (page) currentActionPage.value = page
      const response = await adminService.getAdminActions(currentActionPage.value, actionPageSize.value, filters)
      adminActions.value = response.actions
      totalActions.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch admin actions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed
  const hasUsers = computed(() => users.value.length > 0)
  const hasRecipes = computed(() => recipes.value.length > 0)
  const hasActions = computed(() => adminActions.value.length > 0)

  return {
    // State
    users,
    totalUsers,
    currentUserPage,
    userPageSize,
    recipes,
    totalRecipes,
    currentRecipePage,
    recipePageSize,
    adminActions,
    totalActions,
    currentActionPage,
    actionPageSize,
    platformStats,
    dailyStats,
    topUsers,
    loading,
    error,

    // Computed
    hasUsers,
    hasRecipes,
    hasActions,

    // User Management Actions
    fetchUsers,
    getUserDetails,
    updateUserRole,
    banUser,
    unbanUser,
    deleteUser,

    // Recipe Moderation Actions
    fetchRecipesForModeration,
    hideRecipe,
    unhideRecipe,
    deleteRecipe,

    // Analytics Actions
    fetchPlatformStats,
    fetchDailyStats,
    fetchTopUsers,

    // Admin Actions Log
    fetchAdminActions
  }
})