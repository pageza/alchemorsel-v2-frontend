<template>
  <div class="default-layout">
    <header class="navbar">
      <div class="nav-content">
        <div class="nav-brand" @click="$router.push('/')">🧪 Alchemorsel</div>
        
        <nav class="nav-links">
          <a href="#" @click.prevent="$router.push('/')">Home</a>
          <a href="#" @click.prevent="$router.push('/recipes')">Browse Recipes</a>
          <a href="#" @click.prevent="$router.push('/about')">About</a>
        </nav>

        <!-- Show different buttons based on auth status -->
        <div v-if="!isAuthenticated" class="auth-buttons">
          <el-button
            class="login-btn"
            @click="handleLoginClick"
          >
            Login
          </el-button>
          <el-button
            type="primary"
            class="signup-btn"
            @click="$router.push('/register')"
          >
            Sign Up
          </el-button>
        </div>
        
        <div v-else class="user-section">
          <span class="welcome-text">Welcome, {{ userName }}</span>
          <el-button
            class="dashboard-btn"
            @click="$router.push('/dashboard')"
          >
            Dashboard
          </el-button>
          <el-button
            class="logout-btn"
            @click="handleLogout"
          >
            Logout
          </el-button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => {
  return authStore.user?.name || authStore.user?.username || 'User'
})

const isLoggingOut = ref(false)

const handleLoginClick = async () => {
  console.log('🔑 Login button clicked in DefaultLayout')
  console.log('🔑 Current route:', router.currentRoute.value.name)
  console.log('🔑 Current path:', router.currentRoute.value.path)
  console.log('🔑 Is authenticated:', isAuthenticated.value)
  console.log('🔑 Auth store token exists:', !!authStore.token)
  console.log('🔑 Auth store user:', authStore.user)
  
  try {
    console.log('🔑 Attempting router.push("/login")')
    await router.push('/login')
    console.log('🔑 Navigation to /login completed')
    console.log('🔑 New route:', router.currentRoute.value.name)
    console.log('🔑 New path:', router.currentRoute.value.path)
  } catch (error) {
    console.error('🔑 Navigation error:', error)
  }
}

const handleLogout = async () => {
  if (isLoggingOut.value) {
    console.log('Already logging out from DefaultLayout, ignoring...')
    return
  }
  
  console.log('Logout clicked from DefaultLayout')
  isLoggingOut.value = true
  
  try {
    await authStore.logout()
    console.log('Logout successful from DefaultLayout, redirecting to home')
    router.push('/')
  } catch (error) {
    console.error('Logout failed from DefaultLayout:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
.default-layout {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #34495e;
  color: white;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.nav-brand:hover {
  opacity: 0.8;
}

.nav-links {
  display: flex;
  gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  font-size: 1rem;
}

.nav-links a:hover {
  opacity: 1;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  color: white;
  font-size: 0.9rem;
  opacity: 0.9;
}

.login-btn {
  background: transparent;
  border: 1px solid #409eff;
  color: #409eff;
}

.signup-btn {
  /* Uses default primary styling */
}

.dashboard-btn {
  background: transparent;
  border: 1px solid #27ae60;
  color: #27ae60;
}

.logout-btn {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

.logout-btn:hover {
  background: #e74c3c;
  color: white;
}

.main-content {
  flex: 1;
  width: 100vw;
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 15px;
  }
  
  .nav-links {
    gap: 20px;
  }
  
  .nav-links a {
    font-size: 0.9rem;
  }
  
  .auth-buttons,
  .user-section {
    gap: 8px;
  }
  
  .welcome-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-links {
    display: none;
  }
  
  .nav-brand {
    font-size: 1.25rem;
  }
  
  .user-section {
    flex-direction: column;
    gap: 5px;
  }
  
  .dashboard-btn,
  .logout-btn {
    font-size: 0.8rem;
    padding: 5px 10px;
  }
}
</style> 