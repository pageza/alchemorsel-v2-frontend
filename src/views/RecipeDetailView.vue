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
              v-if="totalTime"
              color="secondary"
              variant="outlined"
            >
              <v-icon start size="small">mdi-clock-outline</v-icon>
              {{ totalTime }}
            </v-chip>
            <v-chip
              v-if="recipe.servings"
              color="secondary"
              variant="outlined"
            >
              <v-icon start size="small">mdi-account-multiple</v-icon>
              {{ recipe.servings }} servings
            </v-chip>
            <v-chip
              v-if="recipe.difficulty"
              :color="difficultyColor"
              variant="outlined"
            >
              <v-icon start size="small">mdi-chef-hat</v-icon>
              {{ recipe.difficulty }}
            </v-chip>
          </div>
          <h1 class="text-h3 font-weight-bold mb-4">{{ recipe.name }}</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-6">
            {{ recipe.description }}
          </p>
          <div class="d-flex align-center mb-6">
            <v-avatar
              :image="recipe.author?.profile_picture_url || ''"
              size="40"
              class="mr-3"
            >
              <v-icon v-if="!recipe.author?.profile_picture_url">mdi-account</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                {{ recipe.author?.name || 'Anonymous Chef' }}
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
              <v-list v-if="hasNutritionalInfo">
                <v-list-item
                  v-if="recipe.calories > 0"
                  title="Calories"
                  :subtitle="`${Math.round(recipe.calories)} kcal`"
                >
                  <template v-slot:prepend>
                    <v-icon color="orange">mdi-fire</v-icon>
                  </template>
                </v-list-item>
                <v-list-item
                  v-if="recipe.protein > 0"
                  title="Protein"
                  :subtitle="`${Math.round(recipe.protein)}g`"
                >
                  <template v-slot:prepend>
                    <v-icon color="red">mdi-arm-flex</v-icon>
                  </template>
                </v-list-item>
                <v-list-item
                  v-if="recipe.carbs > 0"
                  title="Carbohydrates"
                  :subtitle="`${Math.round(recipe.carbs)}g`"
                >
                  <template v-slot:prepend>
                    <v-icon color="brown">mdi-barley</v-icon>
                  </template>
                </v-list-item>
                <v-list-item
                  v-if="recipe.fat > 0"
                  title="Fat"
                  :subtitle="`${Math.round(recipe.fat)}g`"
                >
                  <template v-slot:prepend>
                    <v-icon color="green">mdi-water</v-icon>
                  </template>
                </v-list-item>
              </v-list>
              <v-card-text v-else class="text-center text-medium-emphasis">
                <v-icon size="48" color="grey-lighten-1">mdi-nutrition</v-icon>
                <p class="mt-2">Nutritional information not available</p>
              </v-card-text>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipes } from '@/composables/useRecipes'
import type { Recipe } from '@/types/recipe.types'

const route = useRoute()
// const router = useRouter()
const { fetchRecipeById, toggleFavorite, isLoading, error } = useRecipes()

const recipe = ref<Recipe | null>(null)

// Computed property to check if nutritional info is available
const hasNutritionalInfo = computed(() => {
  if (!recipe.value) return false
  return recipe.value.calories > 0 || 
         recipe.value.protein > 0 || 
         recipe.value.carbs > 0 || 
         recipe.value.fat > 0
})

// Computed property for total cooking time
const totalTime = computed(() => {
  if (!recipe.value) return ''
  const prep = recipe.value.prep_time || 0
  const cook = recipe.value.cook_time || 0
  const total = prep + cook
  
  if (total === 0) return ''
  if (total < 60) return `${total} mins`
  
  const hours = Math.floor(total / 60)
  const mins = total % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
})

// Computed property for difficulty color
const difficultyColor = computed(() => {
  if (!recipe.value?.difficulty) return 'secondary'
  
  const difficulty = recipe.value.difficulty.toLowerCase()
  switch (difficulty) {
    case 'easy': return 'success'
    case 'medium': return 'warning'
    case 'hard': return 'error'
    default: return 'secondary'
  }
})

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
    console.log(`🔄 [Detail] Toggling favorite for ${recipe.value.name}, current status: ${recipe.value.isFavorite}`)
    // Pass the current favorite status to the toggle function
    const result = await toggleFavorite(recipe.value.id, recipe.value.isFavorite)
    console.log(`✅ [Detail] Toggle result: ${result.is_favorite}`)
    // Update local state with the API response
    recipe.value.isFavorite = result.is_favorite
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