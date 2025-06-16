<template>
  <div class="authenticated-layout">
    <header class="navbar">
      <div class="nav-content">
        <div class="nav-brand" @click="$router.push('/dashboard')" data-testid="brand-logo">
          🧪 Alchemorsel
        </div>

        <nav class="nav-links">
          <a href="#" @click.prevent="$router.push('/dashboard')" :class="{ active: currentRoute === 'dashboard' }" data-testid="nav-dashboard">
            Dashboard
          </a>
          <a href="#" @click.prevent="$router.push('/recipes')" :class="{ active: currentRoute === 'recipes' }" data-testid="nav-recipes">
            Browse Recipes
          </a>
          <a href="#" @click.prevent="$router.push('/generate')" :class="{ active: currentRoute === 'generate' }" data-testid="nav-generate">
            Generate Recipe
          </a>
          <a href="#" @click.prevent="$router.push('/favorites')" :class="{ active: currentRoute === 'favorites' }" data-testid="nav-favorites">
            My Favorites
          </a>
        </nav>

        <div class="user-menu">
          <span class="welcome-text">Welcome, {{ userName }}</span>
          <el-dropdown trigger="click">
            <div class="avatar" data-testid="user-avatar">
              {{ userInitials }}
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/profile/edit')" data-testid="profile-settings">
                  <el-icon><User /></el-icon>
                  Profile Settings
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout" data-testid="logout-button">
                  <el-icon><SwitchButton /></el-icon>
                  Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { User, SwitchButton } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isLoggingOut = ref(false)

const currentRoute = computed(() => {
  return route.name as string
})

const userName = computed(() => {
  return authStore.user?.name || authStore.user?.username || 'User'
})

const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = async () => {
  if (isLoggingOut.value) {
    console.log('Already logging out, ignoring...')
    return
  }
  
  console.log('Logout clicked')
  isLoggingOut.value = true
  
  try {
    await authStore.logout()
    console.log('Logout successful, redirecting to home')
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
.authenticated-layout {
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
  gap: 30px;
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
  flex: 1;
  margin-left: 40px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: all 0.2s;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 4px;
  border-bottom: 2px solid transparent;
}

.nav-links a:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.nav-links a.active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  border-bottom-color: #3498db;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  font-size: 0.9rem;
  opacity: 0.9;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #95a5a6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.avatar:hover {
  background: #7f8c8d;
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
  
  .nav-content {
    gap: 15px;
  }
  
  .nav-brand {
    font-size: 1.25rem;
  }
  
  .nav-links {
    gap: 20px;
    margin-left: 20px;
  }
  
  .nav-links a {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
  
  .welcome-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-links {
    display: none;
  }
}
</style>