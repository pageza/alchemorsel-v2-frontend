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
          <v-btn
            variant="outlined"
            color="white"
            @click="handleLoginClick"
          >
            Login
          </v-btn>
          <v-btn
            color="secondary"
            @click="$router.push('/register')"
          >
            Sign Up
          </v-btn>
        </div>
        
        <div v-else class="user-menu">
          <span class="welcome-text">Welcome, {{ userFirstName }}</span>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-avatar
                v-bind="props"
                color="secondary"
                class="cursor-pointer"
                data-testid="user-avatar"
              >
                {{ userInitials }}
              </v-avatar>
            </template>
            <v-list>
              <v-list-item @click="$router.push('/dashboard')" data-testid="nav-dashboard">
                <template v-slot:prepend>
                  <v-icon>mdi-view-dashboard</v-icon>
                </template>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="isAdmin" @click="$router.push('/admin')" data-testid="nav-admin">
                <template v-slot:prepend>
                  <v-icon>mdi-cog</v-icon>
                </template>
                <v-list-item-title>Admin Dashboard</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="$router.push('/profile')" data-testid="view-profile">
                <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-title>View Profile</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$router.push('/profile/edit')" data-testid="profile-settings">
                <template v-slot:prepend>
                  <v-icon>mdi-cog</v-icon>
                </template>
                <v-list-item-title>Profile Settings</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="handleLogout" data-testid="logout-button">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view></router-view>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">🧪 Alchemorsel</h3>
          <p class="footer-description">AI-powered recipe generation tailored to your dietary preferences</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="#" @click.prevent="$router.push('/')">Home</a></li>
            <li><a href="#" @click.prevent="$router.push('/recipes')">Browse Recipes</a></li>
            <li><a href="#" @click.prevent="$router.push('/about')">About</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Account</h4>
          <ul class="footer-links">
            <li v-if="!isAuthenticated"><a href="#" @click.prevent="$router.push('/login')">Login</a></li>
            <li v-if="!isAuthenticated"><a href="#" @click.prevent="$router.push('/register')">Sign Up</a></li>
            <li v-if="isAuthenticated"><a href="#" @click.prevent="$router.push('/dashboard')">Dashboard</a></li>
            <li v-if="isAuthenticated"><a href="#" @click.prevent="$router.push('/profile/edit')">Profile</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Support</h4>
          <ul class="footer-links">
            <li><a href="mailto:support@alchemorsel.com">Contact Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 Alchemorsel. All rights reserved.</p>
      </div>
    </footer>
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

const userFirstName = computed(() => {
  const fullName = authStore.user?.name || authStore.user?.username || 'User'
  
  // If it's an email, extract the part before @
  if (fullName.includes('@')) {
    const emailPart = fullName.split('@')[0]
    // Capitalize first letter
    return emailPart.charAt(0).toUpperCase() + emailPart.slice(1)
  }
  
  // If it's a full name, get the first word and capitalize
  const firstName = fullName.split(' ')[0]
  return firstName.charAt(0).toUpperCase() + firstName.slice(1)
})

const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const isAdmin = computed(() => {
  return authStore.user?.role === 'admin'
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

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
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

.footer {
  background: #2c3e50;
  color: white;
  padding: 40px 20px 20px;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.footer-section h3.footer-title {
  color: #3498db;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.footer-section h4 {
  color: #ecf0f1;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.footer-description {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #3498db;
}

.footer-bottom {
  max-width: 1400px;
  margin: 30px auto 0;
  padding-top: 20px;
  border-top: 1px solid #34495e;
  text-align: center;
  color: #95a5a6;
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
  .user-section,
  .user-menu {
    gap: 8px;
  }
  
  .welcome-text {
    display: none;
  }
  
  .footer {
    padding: 30px 15px 15px;
  }
  
  .footer-content {
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .nav-links {
    display: none;
  }
  
  .nav-brand {
    font-size: 1.25rem;
  }
  
  .user-section,
  .user-menu {
    flex-direction: column;
    gap: 5px;
  }
  
  .dashboard-btn,
  .logout-btn {
    font-size: 0.8rem;
    padding: 5px 10px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-section {
    margin-bottom: 20px;
  }
}
</style> 