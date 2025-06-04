<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/" class="nav__logo">Alchemorsel</router-link>
      <div class="nav__links">
        <template v-if="auth.isAuthenticated">
          <router-link to="/recipes" class="nav__link">Recipes</router-link>
          <router-link to="/recipes/create" class="nav__link">Create Recipe</router-link>
          <router-link to="/profile" class="nav__link">Profile</router-link>
          <button @click="handleLogout" class="nav__link nav__link--button">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav__link">Login</router-link>
          <router-link to="/register" class="nav__link">Register</router-link>
        </template>
      </div>
    </nav>

    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const handleLogout = () => {
  auth.logout();
};
</script>

<style lang="scss">
:root {
  --primary-color: #42b983;
  --primary-color-dark: #369870;
  --primary-color-rgb: 66, 185, 131;
  --secondary-color: #2c3e50;
  --text-color: #2c3e50;
  --background-color: #f8f9fa;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
}

button {
  font-family: inherit;
}

input, textarea, select {
  font-family: inherit;
  font-size: 1rem;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  background-color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
  }

  &__links {
    display: flex;
    gap: 1.5rem;
  }

  &__link {
    color: #2c3e50;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: #42b983;
    }

    &.router-link-active {
      color: #42b983;
    }

    &--button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: inherit;
      font-family: inherit;
      padding: 0;
    }
  }
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
