import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/types/auth.types'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  
  // Actions
  async function login(credentials: LoginRequest): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await AuthService.login(credentials)
      setToken(response.token)
      // Try to fetch profile, but don't fail login if it fails
      try {
        user.value = await AuthService.getProfile()
        // Store user data in localStorage for router guards
        if (user.value) {
          localStorage.setItem('auth_user', JSON.stringify(user.value))
        }
      } catch (profileError) {
        console.warn('Failed to fetch profile after login:', profileError)
        // Set a minimal user object so login can continue
        user.value = {
          id: '',
          email: credentials.email,
          username: credentials.email,
          name: credentials.email,
          role: 'user',
          dietaryPreferences: [],
          allergies: [],
          email_verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      clearAuth()
      throw e
    } finally {
      isLoading.value = false
    }
  }
  
  async function register(data: RegisterRequest): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await AuthService.register(data)
      setToken(response.token)
      // Try to fetch profile, but don't fail registration if it fails
      try {
        user.value = await AuthService.getProfile()
        // Store user data in localStorage for router guards
        if (user.value) {
          localStorage.setItem('auth_user', JSON.stringify(user.value))
        }
      } catch (profileError) {
        console.warn('Failed to fetch profile after registration:', profileError)
        // Set a minimal user object so registration can continue
        user.value = {
          id: '',
          email: data.email,
          username: data.username || data.email,
          name: data.name || data.email,
          role: 'user',
          dietaryPreferences: data.dietary_preferences || [],
          allergies: data.allergies || [],
          email_verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Registration failed'
      clearAuth()
      throw e
    } finally {
      isLoading.value = false
    }
  }
  
  async function fetchProfile(): Promise<void> {
    console.log('fetchProfile called')
    try {
      user.value = await AuthService.getProfile()
      console.log('Profile fetched successfully')
      // Store user data in localStorage for router guards
      if (user.value) {
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
    } catch (error) {
      console.error('fetchProfile failed, calling clearAuth:', error)
      console.trace('fetchProfile failure stack trace')
      clearAuth()
    }
  }
  
  const isLoggingOut = ref(false)
  let logoutCallCount = 0
  let lastLogoutTime = 0
  
  async function logout(): Promise<void> {
    const now = Date.now()
    logoutCallCount++
    
    // Detect spam: more than 3 calls in 5 seconds
    if (now - lastLogoutTime < 5000 && logoutCallCount > 3) {
      console.error('LOGOUT SPAM DETECTED! Preventing further logout calls.')
      console.trace('Logout spam call stack trace')
      return
    }
    
    // Reset counter if it's been more than 5 seconds
    if (now - lastLogoutTime > 5000) {
      logoutCallCount = 1
    }
    
    lastLogoutTime = now
    
    if (isLoggingOut.value) {
      console.warn('Already logging out, ignoring duplicate call')
      return
    }
    
    console.log(`Logout called (call #${logoutCallCount})`)
    isLoggingOut.value = true
    
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      clearAuth()
      isLoggingOut.value = false
      console.log('Logout completed')
    }
  }
  
  function setToken(newToken: string): void {
    token.value = newToken
    StorageService.setToken(newToken)
  }
  
  function clearAuth(): void {
    console.log('clearAuth called')
    console.trace('clearAuth stack trace')
    user.value = null
    token.value = null
    StorageService.clearToken()
    localStorage.removeItem('auth_user')
  }
  
  // Initialize from storage
  function initialize(): void {
    console.log('Initializing auth store from localStorage')
    const storedToken = StorageService.getToken()
    console.log('Stored token found:', !!storedToken)
    if (storedToken) {
      token.value = storedToken
      fetchProfile()
    }
  }
  
  // Auto-initialize when store is created
  initialize()
  
  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    initialize,
  }
}) 