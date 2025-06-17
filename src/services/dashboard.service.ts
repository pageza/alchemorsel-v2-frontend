import api from './api'
import type { Recipe } from '@/types/recipe.types'

export interface DashboardStats {
  recipesGenerated: number
  favorites: number
  thisWeek: number
  primaryDiet: string
}

/**
 * Service for dashboard-related API calls
 */
export class DashboardService {
  /**
   * Get dashboard statistics for the current user
   */
  static async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats')
    return response.data
  }

  /**
   * Get recent favorite recipes for the current user
   */
  static async getRecentFavorites(): Promise<Recipe[]> {
    const response = await api.get<Recipe[]>('/dashboard/favorites/recent')
    return response.data
  }
}