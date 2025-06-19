import apiClient from './api'
import type { 
  User, 
  Recipe, 
  AdminAction, 
  PlatformStats,
  DailyStats,
  TopUser 
} from '@/types'

interface UsersResponse {
  users: User[]
  total: number
  page: number
  page_size: number
}

interface RecipesResponse {
  recipes: Recipe[]
  total: number
  page: number
  page_size: number
}

interface AdminActionsResponse {
  actions: AdminAction[]
  total: number
  page: number
  page_size: number
}

export interface UserDetailsResponse {
  user: User
  stats: {
    recipe_count: number
    favorite_count: number
    last_activity?: string
  }
}

interface DailyStatsResponse {
  stats: DailyStats[]
  days: number
}

interface TopUsersResponse {
  users: TopUser[]
  limit: number
}

class AdminService {
  // User Management
  async getUsers(page = 1, pageSize = 20, search?: string): Promise<UsersResponse> {
    const params: any = { page, page_size: pageSize }
    if (search) params.search = search
    
    const response = await apiClient.get('/admin/users', { params })
    return response.data
  }

  async getUserDetails(userId: string): Promise<UserDetailsResponse> {
    const response = await apiClient.get(`/admin/users/${userId}`)
    return response.data
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await apiClient.put(`/admin/users/${userId}/role`, { role })
  }

  async banUser(userId: string, reason: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/ban`, { reason })
  }

  async unbanUser(userId: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/unban`)
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/admin/users/${userId}`)
  }

  // Recipe Moderation
  async getRecipesForModeration(page = 1, pageSize = 20): Promise<RecipesResponse> {
    const response = await apiClient.get('/admin/recipes', {
      params: { page, page_size: pageSize }
    })
    return response.data
  }

  async hideRecipe(recipeId: string, reason?: string): Promise<void> {
    await apiClient.post(`/admin/recipes/${recipeId}/hide`, { reason })
  }

  async unhideRecipe(recipeId: string): Promise<void> {
    await apiClient.post(`/admin/recipes/${recipeId}/unhide`)
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    await apiClient.delete(`/admin/recipes/${recipeId}`)
  }

  // Analytics
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await apiClient.get('/admin/analytics/platform')
    return response.data
  }

  async getDailyStats(days = 30): Promise<DailyStatsResponse> {
    const response = await apiClient.get('/admin/analytics/daily', {
      params: { days }
    })
    return response.data
  }

  async getTopUsers(limit = 10): Promise<TopUsersResponse> {
    const response = await apiClient.get('/admin/analytics/top-users', {
      params: { limit }
    })
    return response.data
  }

  // Admin Actions Log
  async getAdminActions(
    page = 1, 
    pageSize = 50, 
    filters?: {
      adminId?: string
      targetType?: string
      action?: string
    }
  ): Promise<AdminActionsResponse> {
    const params: any = { page, page_size: pageSize }
    if (filters?.adminId) params.admin_id = filters.adminId
    if (filters?.targetType) params.target_type = filters.targetType
    if (filters?.action) params.action = filters.action

    const response = await apiClient.get('/admin/actions', { params })
    return response.data
  }
}

export default new AdminService()