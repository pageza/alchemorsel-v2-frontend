import api from './api'
import type { User } from '@/types/auth.types'

/**
 * Service to fetch and update user profile.
 */
export class UserService {
  /**
   * Get current user profile.
   */
  static async getProfile(): Promise<User> {
    const response = await api.get<{ profile: User }>('/profile')
    return response.data.profile
  }

  /**
   * Update user profile.
   */
  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<{ profile: User }>('/profile', data)
    return response.data.profile
  }
}