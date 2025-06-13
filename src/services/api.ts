import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'

class ApiService {
  private instance: AxiosInstance
  
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore()
        if (authStore.token) {
          config.headers.Authorization = `Bearer ${authStore.token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    
    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const authStore = useAuthStore()
        const notificationStore = useNotificationStore()
        
        if (error.response?.status === 401) {
          authStore.logout()
          notificationStore.error('Session expired. Please login again.')
        }
        
        return Promise.reject(error)
      }
    )
  }
  
  get api(): AxiosInstance {
    return this.instance
  }
}

export default new ApiService().api 