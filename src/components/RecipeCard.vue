<script setup lang="ts">
import { useUIStore } from '@/stores/ui'

interface Macros {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  macros: Macros
  cuisine: string
  imageUrl: string
}

const props = defineProps<{
  recipe: Recipe
}>()

const uiStore = useUIStore()

// Example recipe data
const recipe = {
  name: 'Classic Margherita Pizza',
  description: 'A traditional Italian pizza with fresh tomatoes, mozzarella, and basil.',
  cuisine: 'Italian',
  imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
}
</script>

<template>
  <div>
    <!-- Vuetify Recipe Card -->
    <template v-if="uiStore.useVuetify">
      <v-card class="mx-auto" max-width="400">
        <v-img
          :src="recipe.imageUrl"
          height="200"
          cover
        ></v-img>

        <v-card-title>{{ recipe.name }}</v-card-title>

        <v-card-text>
          <div class="text-subtitle-1 mb-2">{{ recipe.cuisine }}</div>
          <div class="text-body-2">{{ recipe.description }}</div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-share</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>

    <!-- Tailwind Recipe Card -->
    <template v-else>
      <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <img class="w-full h-48 object-cover" :src="recipe.imageUrl" :alt="recipe.name">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ recipe.name }}</div>
          <p class="text-gray-700 text-base mb-2">{{ recipe.cuisine }}</p>
          <p class="text-gray-600 text-sm">{{ recipe.description }}</p>
        </div>
        <div class="px-6 pt-4 pb-2 flex justify-end space-x-2">
          <button class="p-2 rounded-full hover:bg-gray-100">
            <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button class="p-2 rounded-full hover:bg-gray-100">
            <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.recipe-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 1rem 0;
}

.macros {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}
</style> 