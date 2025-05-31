<template>
  <nav class="navigation">
    <div class="nav-brand">
      <router-link to="/" class="brand-link">Alchemorsel</router-link>
    </div>
    
    <div class="nav-links">
      <router-link to="/recipes" class="nav-link">Recipes</router-link>
      <router-link to="/profile" class="nav-link">Profile</router-link>
      <button v-if="isLoggedIn" @click="handleLogout" class="nav-link logout">Logout</button>
      <router-link v-else to="/login" class="nav-link">Login</router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoggedIn = ref(false)

const checkAuth = () => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
}

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      await axios.post('/api/v1/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    localStorage.removeItem('token')
    isLoggedIn.value = false
    router.push('/login')
  }
}

onMounted(() => {
  checkAuth()
})
</script>

<style scoped>
.navigation {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.brand-link {
  color: #4CAF50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #f5f5f5;
}

.nav-link.router-link-active {
  color: #4CAF50;
  font-weight: 500;
}

.logout {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: #dc3545;
}

.logout:hover {
  background-color: #fff5f5;
}
</style> 