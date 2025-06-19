import api from './api'
import type { User } from '@/types/auth.types'

export interface UpdateProfileData {
  username?: string
  bio?: string
  profile_picture_url?: string
  privacy_level?: string
  preferences?: {
    dietary_lifestyles?: string[]
    cuisine_preferences?: string[]
    allergies?: string[]
    // Legacy support
    dietary_prefs?: string[]
    favorite_cuisine?: string
  }
}

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
  static async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put<{ profile: User }>('/profile', data)
    return response.data.profile
  }

  /**
   * Update dietary preferences specifically.
   */
  static async updateDietaryPreferences(dietaryPrefs: string[], allergies: string[]): Promise<User> {
    return this.updateProfile({
      preferences: {
        dietary_prefs: dietaryPrefs,
        allergies: allergies
      }
    })
  }
}