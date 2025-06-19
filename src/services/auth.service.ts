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

  static async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/password-reset/request', { email })
    return response.data
  }

  static async verifyResetToken(token: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/password-reset/verify', { token })
    return response.data
  }

  static async completePasswordReset(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/password-reset/complete', { 
      token, 
      new_password: newPassword 
    })
    return response.data
  }

  static async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/email-verification/verify', { token })
    return response.data
  }

  static async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/email-verification/resend', { email })
    return response.data
  }
} 