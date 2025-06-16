<template>
  <nav class="navbar">
    <div class="navbar-left">Alchemorsel</div>
    <div class="navbar-right">
      <v-btn class="navbar-link" variant="text" @click="goToRecipes">Main Recipes</v-btn>
      <template v-if="!isLoggedIn">
        <v-btn class="navbar-auth-btn" @click="goToAuth">Sign In / Register</v-btn>
      </template>
      <template v-else>
        <v-btn color="error" @click="logout">Logout</v-btn>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Placeholder for auth state; replace with real store logic later
const isLoggedIn = ref(false)

function goToAuth() {
  router.push('/login')
}

function logout() {
  // Placeholder: set isLoggedIn to false; replace with real logout logic
  isLoggedIn.value = false
  router.push('/')
}

function goToRecipes() {
  router.push('/recipes')
}
</script>

<style scoped>
.navbar {
  width: 100vw;
  height: 64px;
  background: #2d221a;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.navbar-left {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #f5e6c8;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
:deep(.v-btn) {
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
}
:deep(.v-btn[color="primary"]) {
  background: #d2691e;
  color: #fff;
  border: none;
}
:deep(.v-btn[color="error"]) {
  background: #3a2a1a;
  color: #f5e6c8;
  border: 1.5px solid #a67c52;
}
.navbar-auth-btn {
  background: #d2691e !important;
  color: #fff !important;
  font-weight: 700;
  border-radius: 8px;
  box-shadow: none;
  letter-spacing: 0.5px;
  padding: 0 20px;
  transition: background 0.2s;
}
.navbar-auth-btn:hover, .navbar-auth-btn:focus {
  background: #b85c16 !important;
}
.navbar-link {
  color: #f5e6c8 !important;
  font-weight: 500;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
  background: none !important;
  box-shadow: none !important;
  text-transform: none;
  min-width: 0;
  padding: 0 16px;
}
.navbar-link:hover, .navbar-link:focus {
  color: #ffe1a6 !important;
  background: none !important;
}
</style> 