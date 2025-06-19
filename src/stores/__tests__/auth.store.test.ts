import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import type { User, LoginRequest, RegisterRequest } from '@/types/auth.types'

// Mock the services
vi.mock('@/services/auth.service')
vi.mock('@/services/storage.service')

describe('Auth Store', () => {
  let store: any

  const mockUser: User = {
    id: 'test-id',
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test User',
    profilePictureUrl: 'https://example.com/avatar.jpg',
    dietaryPreferences: ['vegetarian'],
    allergies: ['nuts'],
    email_verified: true,
    email_verified_at: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }

  const mockToken = 'mock-jwt-token'

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Create a fresh pinia instance
    setActivePinia(createPinia())
    
    // Mock storage service - return null by default
    vi.mocked(StorageService.getToken).mockReturnValue(null)
    vi.mocked(StorageService.setToken).mockImplementation(() => {})
    vi.mocked(StorageService.clearToken).mockImplementation(() => {})
    
    // Dynamically import store to avoid auto-initialization issues
    const { useAuthStore } = await import('../auth.store')
    store = useAuthStore()
  })

  describe('Initial State', () => {
    it('should have correct initial state when no token in storage', () => {
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.currentUser).toBeNull()
    })
  })

  describe('Login', () => {
    const loginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    }

    it('should login successfully', async () => {
      vi.mocked(AuthService.login).mockResolvedValue({ 
        token: mockToken,
        user_id: 'test-id',
        email_verified: true 
      })
      vi.mocked(AuthService.getProfile).mockResolvedValue(mockUser)

      await store.login(loginRequest)

      expect(store.token).toBe(mockToken)
      expect(store.user).toEqual(mockUser)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
      expect(vi.mocked(StorageService.setToken)).toHaveBeenCalledWith(mockToken)
    })

    it('should handle login with profile fetch failure', async () => {
      vi.mocked(AuthService.login).mockResolvedValue({ 
        token: mockToken,
        user_id: 'test-id' 
      })
      vi.mocked(AuthService.getProfile).mockRejectedValue(new Error('Profile fetch failed'))

      await store.login(loginRequest)

      // Should still be logged in with minimal user data
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
      expect(store.user).toMatchObject({
        email: loginRequest.email,
        username: loginRequest.email
      })
    })

    it('should handle login failure', async () => {
      const error = new Error('Invalid credentials')
      vi.mocked(AuthService.login).mockRejectedValue(error)

      await expect(store.login(loginRequest)).rejects.toThrow('Invalid credentials')
      
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe('Invalid credentials')
      expect(vi.mocked(StorageService.clearToken)).toHaveBeenCalled()
    })

    it('should set loading state during login', async () => {
      vi.mocked(AuthService.login).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ 
          token: mockToken,
          user_id: 'test-id' 
        }), 10))
      )

      const loginPromise = store.login(loginRequest)
      
      expect(store.isLoading).toBe(true)
      
      await loginPromise
      
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Register', () => {
    const registerRequest: RegisterRequest = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      dietary_preferences: ['vegetarian'],
      allergies: ['nuts']
    }

    it('should register successfully', async () => {
      vi.mocked(AuthService.register).mockResolvedValue({ 
        token: mockToken,
        user_id: 'test-id' 
      })
      vi.mocked(AuthService.getProfile).mockResolvedValue(mockUser)

      await store.register(registerRequest)

      expect(store.token).toBe(mockToken)
      expect(store.user).toEqual(mockUser)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
      expect(vi.mocked(StorageService.setToken)).toHaveBeenCalledWith(mockToken)
    })

    it('should handle register with profile fetch failure', async () => {
      vi.mocked(AuthService.register).mockResolvedValue({ 
        token: mockToken,
        user_id: 'test-id' 
      })
      vi.mocked(AuthService.getProfile).mockRejectedValue(new Error('Profile fetch failed'))

      await store.register(registerRequest)

      // Should still be registered with data from request
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
      expect(store.user).toMatchObject({
        email: registerRequest.email,
        username: registerRequest.username,
        name: registerRequest.name,
        dietaryPreferences: registerRequest.dietary_preferences,
        allergies: registerRequest.allergies
      })
    })

    it('should handle registration failure', async () => {
      const error = new Error('Email already exists')
      vi.mocked(AuthService.register).mockRejectedValue(error)

      await expect(store.register(registerRequest)).rejects.toThrow('Email already exists')
      
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe('Email already exists')
      expect(vi.mocked(StorageService.clearToken)).toHaveBeenCalled()
    })
  })

  describe('Logout', () => {
    beforeEach(async () => {
      // Setup authenticated state
      store.token = mockToken
      store.user = mockUser
    })

    it('should logout successfully', async () => {
      vi.mocked(AuthService.logout).mockResolvedValue()

      await store.logout()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(vi.mocked(AuthService.logout)).toHaveBeenCalled()
      expect(vi.mocked(StorageService.clearToken)).toHaveBeenCalled()
    })

    it('should clear auth even if logout API fails', async () => {
      vi.mocked(AuthService.logout).mockRejectedValue(new Error('Network error'))

      await store.logout()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(vi.mocked(StorageService.clearToken)).toHaveBeenCalled()
    })

    it('should prevent duplicate logout calls', async () => {
      vi.mocked(AuthService.logout).mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 50))
      )

      // Start first logout
      const logout1 = store.logout()
      
      // Try second logout immediately
      const logout2 = store.logout()

      await Promise.all([logout1, logout2])

      // Should only call logout API once
      expect(vi.mocked(AuthService.logout)).toHaveBeenCalledTimes(1)
    })
  })

  describe('Fetch Profile', () => {
    beforeEach(() => {
      store.token = mockToken
    })

    it('should fetch profile successfully', async () => {
      vi.mocked(AuthService.getProfile).mockResolvedValue(mockUser)

      await store.fetchProfile()

      expect(store.user).toEqual(mockUser)
    })

    it('should clear auth on profile fetch failure', async () => {
      vi.mocked(AuthService.getProfile).mockRejectedValue(new Error('Unauthorized'))

      await store.fetchProfile()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(vi.mocked(StorageService.clearToken)).toHaveBeenCalled()
    })
  })

  describe('Computed Properties', () => {
    it('should compute isAuthenticated correctly', () => {
      expect(store.isAuthenticated).toBe(false)
      
      store.token = mockToken
      expect(store.isAuthenticated).toBe(true)
      
      store.token = null
      expect(store.isAuthenticated).toBe(false)
    })

    it('should compute currentUser correctly', () => {
      expect(store.currentUser).toBeNull()
      
      store.user = mockUser
      expect(store.currentUser).toEqual(mockUser)
      
      store.user = null
      expect(store.currentUser).toBeNull()
    })
  })

  describe('Initialize', () => {
    it('should initialize from storage if token exists', async () => {
      // Mock storage with existing token
      vi.mocked(StorageService.getToken).mockReturnValue(mockToken)
      vi.mocked(AuthService.getProfile).mockResolvedValue(mockUser)
      
      // Call initialize manually
      store.initialize()
      
      expect(store.token).toBe(mockToken)
      
      // Wait for profile fetch
      await vi.waitFor(() => {
        expect(vi.mocked(AuthService.getProfile)).toHaveBeenCalled()
      })
    })
  })
})