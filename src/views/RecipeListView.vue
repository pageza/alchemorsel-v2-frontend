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
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            to="/recipes/create"
          >
            Create Recipe
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
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Sort by"
            variant="outlined"
            density="comfortable"
            hide-details
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <!-- Recipe Grid -->
    <v-container class="py-4">
      <v-row>
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
              :src="recipe.imageUrl || recipe.image"
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
import { ref, onMounted } from 'vue'
import { useRecipes } from '@/composables/useRecipes'

const { recipes, fetchRecipes } = useRecipes()
const search = ref('')
const category = ref(null)
const sortBy = ref('newest')

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