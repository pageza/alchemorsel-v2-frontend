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
      await fetchProfile()
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
      await fetchProfile()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Registration failed'
      clearAuth()
      throw e
    } finally {
      isLoading.value = false
    }
  }
  
  async function fetchProfile(): Promise<void> {
    try {
      user.value = await AuthService.getProfile()
    } catch {
      clearAuth()
    }
  }
  
  async function logout(): Promise<void> {
    try {
      await AuthService.logout()
    } finally {
      clearAuth()
    }
  }
  
  function setToken(newToken: string): void {
    token.value = newToken
    StorageService.setToken(newToken)
  }
  
  function clearAuth(): void {
    user.value = null
    token.value = null
    StorageService.clearToken()
  }
  
  // Initialize from storage
  function initialize(): void {
    const storedToken = StorageService.getToken()
    if (storedToken) {
      token.value = storedToken
      fetchProfile()
    }
  }
  
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