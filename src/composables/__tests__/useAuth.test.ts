import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuth } from '../useAuth'
import type { LoginRequest, RegisterRequest } from '@/types/auth.types'

// Mock the auth service to prevent API calls
vi.mock('@/services/auth.service', () => ({
  AuthService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn()
  }
}))

vi.mock('@/services/storage.service', () => ({
  StorageService: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
}))

describe('useAuth Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('should expose isAuthenticated computed property', async () => {
    const auth = useAuth()
    
    // Initially not authenticated
    expect(auth.isAuthenticated.value).toBe(false)
    
    // Login to test authentication state
    const { useAuthStore } = await import('@/stores/auth.store')
    const store = useAuthStore()
    store.token = 'test-token'
    
    expect(auth.isAuthenticated.value).toBe(true)
  })

  it('should expose currentUser computed property', async () => {
    const auth = useAuth()
    
    // Initially no user
    expect(auth.currentUser.value).toBeNull()
    
    // Set user to test current user
    const { useAuthStore } = await import('@/stores/auth.store')
    const store = useAuthStore()
    store.user = {
      id: 'test-id',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      role: 'user',
      dietaryPreferences: [],
      allergies: [],
      email_verified: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    
    expect(auth.currentUser.value).toEqual(store.user)
  })

  it('should expose login method from store', () => {
    const auth = useAuth()
    
    expect(typeof auth.login).toBe('function')
  })

  it('should expose register method from store', () => {
    const auth = useAuth()
    
    expect(typeof auth.register).toBe('function')
  })

  it('should expose logout method from store', () => {
    const auth = useAuth()
    
    expect(typeof auth.logout).toBe('function')
  })

  it('should handle multiple instances correctly', () => {
    const auth1 = useAuth()
    const auth2 = useAuth()
    
    // Both instances should reference the same computed values
    expect(auth1.isAuthenticated.value).toBe(auth2.isAuthenticated.value)
    expect(auth1.currentUser.value).toBe(auth2.currentUser.value)
  })
})