import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Composable for authentication operations and state.
 */
export function useAuth() {
  const store = useAuthStore()
  return {
    isAuthenticated: computed(() => store.isAuthenticated),
    currentUser: computed(() => store.currentUser),
    login: store.login,
    register: store.register,
    logout: store.logout,
  }
}