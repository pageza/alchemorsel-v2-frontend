import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthService } from '@/services/auth.service'
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth.types'

// Mock the api module
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

// Import api after mocking
import api from '@/services/api'
const mockApi = vi.mocked(api)

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockCredentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      }

      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token'
      }

      mockApi.post.mockResolvedValue({ data: mockResponse })

      const result = await AuthService.login(mockCredentials)

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', mockCredentials)
      expect(result).toEqual(mockResponse)
    })

    it('should handle login failures', async () => {
      const mockCredentials: LoginRequest = {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }

      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      }

      mockApi.post.mockRejectedValue(mockError)

      await expect(AuthService.login(mockCredentials)).rejects.toEqual(mockError)
      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', mockCredentials)
    })
  })

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockRegisterData: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        dietary_preferences: ['vegetarian'],
        allergies: ['nuts']
      }

      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token'
      }

      mockApi.post.mockResolvedValue({ data: mockResponse })

      const result = await AuthService.register(mockRegisterData)

      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', mockRegisterData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle registration validation errors', async () => {
      const mockRegisterData: RegisterRequest = {
        name: '',
        email: 'invalid-email',
        password: '123',
        username: '',
        dietary_preferences: [],
        allergies: []
      }

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Validation failed' }
        }
      }

      mockApi.post.mockRejectedValue(mockError)

      await expect(AuthService.register(mockRegisterData)).rejects.toEqual(mockError)
    })
  })

  describe('logout', () => {
    it('should successfully logout user', async () => {
      mockApi.post.mockResolvedValue({ data: {} })

      await AuthService.logout()

      expect(mockApi.post).toHaveBeenCalledWith('/profile/logout')
    })

    it('should handle logout errors', async () => {
      const mockError = new Error('Network error')
      mockApi.post.mockRejectedValue(mockError)

      await expect(AuthService.logout()).rejects.toThrow('Network error')
    })
  })

  describe('getProfile', () => {
    it('should successfully fetch user profile', async () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        profilePictureUrl: 'https://example.com/avatar.jpg',
        dietaryPreferences: ['vegetarian'],
        allergies: ['nuts'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      mockApi.get.mockResolvedValue({
        data: { profile: mockUser }
      })

      const result = await AuthService.getProfile()

      expect(mockApi.get).toHaveBeenCalledWith('/profile')
      expect(result).toEqual(mockUser)
    })

    it('should handle unauthorized access to profile', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      }

      mockApi.get.mockRejectedValue(mockError)

      await expect(AuthService.getProfile()).rejects.toEqual(mockError)
    })
  })
})