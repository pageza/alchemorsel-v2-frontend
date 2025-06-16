<template>
  <div>
    <!-- Header Section -->
    <v-container class="py-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Recipes</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Discover and explore our collection of recipes</p>
          </div>
          <!-- Only show generate button when there are no recipes or no search results -->
          <v-btn
            v-if="shouldShowGenerateButton"
            color="primary"
            prepend-icon="mdi-robot"
            to="/generate"
            data-testid="generate-recipe-btn"
          >
            Generate Recipe with AI
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Filters Section -->
    <v-container class="py-4">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Search recipes"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            data-testid="recipe-search"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="category"
            :items="categories"
            label="Category"
            variant="outlined"
            density="comfortable"
            hide-details
            data-testid="category-filter"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Sort by"
            variant="outlined"
            data-testid="sort-filter"
            density="comfortable"
            hide-details
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <!-- Recipe Grid -->
    <v-container class="py-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-h6 mt-4">Loading recipes...</p>
      </div>

      <!-- Error State -->
      <v-alert
        v-else-if="error"
        type="error"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <!-- Empty State -->
      <div v-else-if="!recipes || recipes.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chef-hat</v-icon>
        <h2 class="text-h5 mb-2">No recipes found</h2>
        <p class="text-body-1 text-medium-emphasis mb-4">
          {{ search ? 'No recipes match your search. Try generating one with AI!' : 'Get started by creating your first recipe!' }}
        </p>
        <div class="d-flex justify-center gap-3">
          <v-btn
            color="primary"
            prepend-icon="mdi-robot"
            to="/generate"
            data-testid="generate-recipe-empty-btn"
          >
            Generate Recipe with AI
          </v-btn>
          <v-btn
            color="secondary"
            prepend-icon="mdi-plus"
            to="/recipes/create"
            variant="outlined"
          >
            Create Recipe
          </v-btn>
        </div>
      </div>

      <!-- Recipe Grid -->
      <v-row v-else>
        <v-col
          v-for="recipe in recipes"
          :key="recipe.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            :to="`/recipes/${recipe.id}`"
            class="h-100"
            elevation="2"
            hover
          >
            <v-img
              :src="recipe.image_url"
              height="200"
              cover
              class="align-end"
            >
              <v-chip
                class="ma-2"
                color="primary"
                size="small"
              >
                {{ recipe.category }}
              </v-chip>
            </v-img>

            <v-card-title class="text-h6">
              {{ recipe.name }}
            </v-card-title>

            <v-card-text>
              <p class="text-body-2 text-medium-emphasis">
                {{ recipe.description }}
              </p>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                variant="text"
                color="primary"
                :to="`/recipes/${recipe.id}`"
              >
                View Recipe
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRecipes } from '@/composables/useRecipes'

const { recipes, fetchRecipes, isLoading, error } = useRecipes()
const search = ref('')
const category = ref(null)
const sortBy = ref('newest')

// Show generate button only when there are no recipes found or no search results
const shouldShowGenerateButton = computed(() => {
  // Don't show during loading
  if (isLoading.value) return false
  
  // Show if there are no recipes at all, or if search returns no results
  return !recipes.value || recipes.value.length === 0
})

const categories = [
  'All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Drinks',
]

const sortOptions = [
  { title: 'Newest', value: 'newest' },
  { title: 'Most Popular', value: 'popular' },
  { title: 'Highest Rated', value: 'rating' },
  { title: 'A-Z', value: 'name' },
]

onMounted(() => {
  fetchRecipes()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
}
</style> 