import api from './api'
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth.types'

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  }

  static async logout(): Promise<void> {
    await api.post('/profile/logout')
  }

  static async getProfile(): Promise<User> {
    const response = await api.get<{ profile: User }>(
      '/profile'
    )
    return response.data.profile
  }
} 