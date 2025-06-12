<template>
  <div>
    <!-- Vuetify Navigation -->
    <template v-if="uiStore.useVuetify">
      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Alchemorsel</v-toolbar-title>
        <v-spacer></v-spacer>
        <UIFrameworkToggle />
      </v-app-bar>

      <v-navigation-drawer v-model="drawer">
        <v-list>
          <v-list-item
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            :prepend-icon="item.icon"
            :title="item.title"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </template>

    <!-- Tailwind Navigation -->
    <template v-else>
      <header class="bg-white shadow">
        <div class="flex items-center justify-between px-4 py-3">
          <button
            @click="drawer = !drawer"
            class="p-2 rounded-md hover:bg-gray-100"
          >
            <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-xl font-semibold">Alchemorsel</h1>
          <UIFrameworkToggle />
        </div>
      </header>

      <div
        v-if="drawer"
        class="fixed inset-0 z-40"
        @click="drawer = false"
      >
        <div class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div class="p-4">
            <nav>
              <a
                v-for="item in menuItems"
                :key="item.path"
                :href="item.path"
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <svg
                  class="h-5 w-5 mr-3"
                  :viewBox="getIconPath(item.icon).viewBox"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="getIconPath(item.icon).path"
                  />
                </svg>
                {{ item.title }}
              </a>
            </nav>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import UIFrameworkToggle from './UIFrameworkToggle.vue'

const uiStore = useUIStore()
const drawer = ref(false)

const menuItems = [
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Recipes', path: '/recipes', icon: 'mdi-book' },
  { title: 'Create', path: '/create', icon: 'mdi-plus' },
  { title: 'Profile', path: '/profile', icon: 'mdi-account' },
]

const getIconPath = (icon: string) => {
  const paths: Record<string, { path: string; viewBox: string }> = {
    'mdi-home': {
      path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      viewBox: '0 0 24 24'
    },
    'mdi-book': {
      path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      viewBox: '0 0 24 24'
    },
    'mdi-plus': {
      path: 'M12 4v16m8-8H4',
      viewBox: '0 0 24 24'
    },
    'mdi-account': {
      path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      viewBox: '0 0 24 24'
    }
  }
  return paths[icon] || { path: '', viewBox: '0 0 24 24' }
}
</script>

<style scoped>
</style>   