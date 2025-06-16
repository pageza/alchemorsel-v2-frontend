import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'

class ApiService {
  private instance: AxiosInstance
  
  constructor() {
    const baseURL = '/api/v1'  // Always use relative path to leverage Vite proxy
    console.log('🔧 Creating API instance with baseURL:', baseURL)
    console.log('🔧 Environment:', import.meta.env.MODE)
    console.log('🔧 Using proxy-based API calls (relative URLs)')
    console.log('🔧 VITE_BACKEND_URL for proxy:', import.meta.env.VITE_BACKEND_URL)
    
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'X-API-Version': Date.now().toString(),
      },
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        console.log('🌐 API Request:', config.method?.toUpperCase(), config.baseURL + config.url)
        console.log('🌐 Full URL being used:', config.baseURL + config.url)
        
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