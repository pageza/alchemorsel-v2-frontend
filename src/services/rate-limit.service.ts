import axios from 'axios'

export interface RateLimitStatus {
  limit: number
  remaining: number
  reset_time: number
  window: string
  recipe_id?: string
}

export class RateLimitService {
  private static baseURL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}/api/v1/rate-limits`

  /**
   * Get rate limit status for recipe creation
   */
  static async getRecipeCreationLimit(): Promise<RateLimitStatus> {
    try {
      const response = await axios.get(`${this.baseURL}/recipe-creation`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to get recipe creation rate limit:', error)
      throw error
    }
  }

  /**
   * Get rate limit status for recipe modification for a specific recipe
   */
  static async getRecipeModificationLimit(recipeId: string): Promise<RateLimitStatus> {
    try {
      const response = await axios.get(`${this.baseURL}/recipe-modification/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to get recipe modification rate limit:', error)
      throw error
    }
  }

  /**
   * Format reset time as human-readable string
   */
  static formatResetTime(resetTime: number): string {
    const now = new Date()
    const reset = new Date(resetTime * 1000)
    const diffMs = reset.getTime() - now.getTime()
    
    if (diffMs <= 0) {
      return 'Now'
    }
    
    const diffMinutes = Math.ceil(diffMs / (1000 * 60))
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`
    }
    
    const diffHours = Math.ceil(diffMinutes / 60)
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  }

  /**
   * Get time until reset in seconds
   */
  static getSecondsUntilReset(resetTime: number): number {
    const now = Math.floor(Date.now() / 1000)
    return Math.max(0, resetTime - now)
  }

  /**
   * Check if rate limit is exceeded
   */
  static isRateLimited(status: RateLimitStatus): boolean {
    return status.remaining <= 0
  }

  /**
   * Get progress percentage (0-100)
   */
  static getUsagePercentage(status: RateLimitStatus): number {
    const used = status.limit - status.remaining
    return Math.round((used / status.limit) * 100)
  }
}