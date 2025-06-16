<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="text-h6 mt-4">Loading recipe...</p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      class="ma-4"
    >
      {{ error }}
    </v-alert>

    <!-- Recipe not found -->
    <div v-else-if="!recipe" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chef-hat</v-icon>
      <h2 class="text-h5 mb-2">Recipe not found</h2>
      <p class="text-body-1 text-medium-emphasis mb-4">
        The recipe you're looking for doesn't exist.
      </p>
      <v-btn
        color="primary"
        @click="$router.back()"
      >
        Go Back
      </v-btn>
    </div>

    <!-- Recipe Content -->
    <div v-else>
      <!-- Recipe Header -->
      <v-container class="py-8">
      <v-row>
        <v-col cols="12" md="8">
          <div class="d-flex align-center mb-4">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              class="mr-4"
              @click="$router.back()"
            ></v-btn>
            <v-chip color="primary" class="mr-2">
              {{ recipe.category }}
            </v-chip>
            <v-chip
              color="secondary"
              variant="outlined"
            >
              30 mins
            </v-chip>
          </div>
          <h1 class="text-h3 font-weight-bold mb-4">{{ recipe.name }}</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-6">
            {{ recipe.description }}
          </p>
          <div class="d-flex align-center mb-6">
            <v-avatar
              image=""
              size="40"
              class="mr-3"
            ></v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                Recipe Author
              </div>
              <div class="text-caption text-medium-emphasis">
                Posted {{ formatDate(recipe.created_at) }}
              </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              :icon="recipe.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="recipe.isFavorite ? 'red' : 'default'"
              variant="text"
              class="mr-2"
              @click="handleToggleFavorite"
            ></v-btn>
            <v-btn
              icon="mdi-share-variant"
              variant="text"
            ></v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <v-img
            :src="recipe.image_url"
            height="400"
            cover
            class="rounded-lg"
          ></v-img>
        </v-col>
      </v-row>
    </v-container>

    <!-- Recipe Content -->
    <v-container class="py-8">
      <v-row>
        <!-- Left Column - Ingredients -->
        <v-col cols="12" md="4">
          <v-card class="mb-6">
            <v-card-title class="text-h5 font-weight-bold">
              Ingredients
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(ingredient, index) in recipe.ingredients"
                  :key="index"
                  :title="ingredient"
                >
                  <template v-slot:prepend>
                    <v-checkbox-btn></v-checkbox-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title class="text-h5 font-weight-bold">
              Nutrition
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  title="Calories"
                  :subtitle="`${recipe.calories} kcal`"
                ></v-list-item>
                <v-list-item
                  title="Protein"
                  :subtitle="`${recipe.protein}g`"
                ></v-list-item>
                <v-list-item
                  title="Carbs"
                  :subtitle="`${recipe.carbs}g`"
                ></v-list-item>
                <v-list-item
                  title="Fat"
                  :subtitle="`${recipe.fat}g`"
                ></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column - Instructions -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-h5 font-weight-bold">
              Instructions
            </v-card-title>
            <v-card-text>
              <v-timeline density="compact" align="start">
                <v-timeline-item
                  v-for="(step, index) in recipe.instructions"
                  :key="index"
                  :dot-color="'primary'"
                  size="small"
                >
                  <template v-slot:opposite>
                    <div class="text-h6 font-weight-bold">
                      Step {{ index + 1 }}
                    </div>
                  </template>
                  <div class="text-body-1">
                    {{ step }}
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>

          <!-- Comments Section -->
          <v-card class="mt-6">
            <v-card-title class="text-h5 font-weight-bold">
              Comments
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="comment in ([] as Array<{ id: string; author: { name: string; avatar: string }; text: string }>)"
                  :key="comment.id"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      :image="comment.author.avatar"
                      size="40"
                    ></v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    {{ comment.author.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ comment.text }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipes } from '@/composables/useRecipes'
import type { Recipe } from '@/types/recipe.types'

const route = useRoute()
// const router = useRouter()
const { fetchRecipeById, toggleFavorite, isLoading, error } = useRecipes()

const recipe = ref<Recipe | null>(null)

// Load recipe by ID
onMounted(async () => {
  const id = route.params.id as string
  const fetchedRecipe = await fetchRecipeById(id)
  recipe.value = fetchedRecipe
})

// Handle favorite toggle
const handleToggleFavorite = async () => {
  if (!recipe.value) return
  
  try {
    await toggleFavorite(recipe.value.id)
    // Update local state
    recipe.value.isFavorite = !recipe.value.isFavorite
  } catch (err) {
    console.error('Failed to toggle favorite:', err)
  }
}

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

</script>

<style scoped>
.v-timeline-item__body {
  margin-bottom: 24px;
}
</style> 