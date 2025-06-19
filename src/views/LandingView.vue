<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <v-container fluid class="hero-section">
      <v-row justify="center" align="center" class="hero-content">
        <v-col cols="12" md="8" lg="6" class="text-center">
          <h1 class="display-1 font-weight-bold mb-6">
            AI-Powered Recipe Magic
          </h1>
          <p class="headline mb-8">
            Create personalized recipes tailored to your dietary preferences and allergies
          </p>
          <div class="hero-buttons">
            <v-btn
              color="primary"
              size="large"
              @click="$router.push('/register')"
              class="mr-4 mb-4"
            >
              Get Started Free
            </v-btn>
            <v-btn
              color="secondary"
              variant="outlined"
              size="large"
              @click="$router.push('/login')"
              class="mb-4"
            >
              Sign In
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Features Section -->
    <v-container class="features-section">
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="text-h4 mb-4">Why Choose Alchemorsel?</h2>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-icon size="64" color="primary" class="mb-4">mdi-brain</v-icon>
          <h3 class="text-h6 mb-3">AI-Generated Recipes</h3>
          <p>Get unique, personalized recipes created by advanced AI technology</p>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-icon size="64" color="primary" class="mb-4">mdi-shield-check</v-icon>
          <h3 class="text-h6 mb-3">Dietary Restrictions</h3>
          <p>Safe recipes that respect your allergies and dietary preferences</p>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-icon size="64" color="primary" class="mb-4">mdi-heart</v-icon>
          <h3 class="text-h6 mb-3">Save Favorites</h3>
          <p>Build your personal collection of tried and tested recipes</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Recipes Section -->
    <v-container class="featured-section">
      <v-row>
        <v-col cols="12" class="text-center mb-6">
          <h2 class="text-h4 mb-4">Featured Recipes</h2>
          <p class="text-body-1 text-medium-emphasis">
            Get a taste of what's possible with Alchemorsel
          </p>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <!-- Recipe Grid -->
      <v-row v-else-if="featuredRecipes && featuredRecipes.length > 0">
        <v-col 
          v-for="recipe in featuredRecipes" 
          :key="recipe.id"
          cols="12" 
          sm="6" 
          md="4"
        >
          <v-card
            class="recipe-preview-card"
            hover
            @click="handleRecipeClick(recipe.id)"
          >
            <!-- Recipe Image -->
            <v-img
              v-if="recipe.image_url"
              :src="recipe.image_url"
              :alt="recipe.name"
              height="200"
              cover
            >
              <template v-slot:error>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon size="64" color="grey-lighten-2">mdi-silverware-fork-knife</v-icon>
                </div>
              </template>
            </v-img>
            <div v-else class="recipe-image-placeholder">
              <v-icon size="64" color="grey-lighten-2">mdi-silverware-fork-knife</v-icon>
            </div>

            <!-- Login Overlay for Unauthenticated Users -->
            <div v-if="!isAuthenticated" class="login-overlay">
              <div class="overlay-content">
                <v-icon size="32" color="white" class="mb-2">mdi-lock</v-icon>
                <p class="text-white text-center mb-2">Sign up to view full recipe</p>
                <v-btn
                  color="primary"
                  size="small"
                  @click.stop="$router.push('/register')"
                >
                  Join Now
                </v-btn>
              </div>
            </div>

            <v-card-title class="text-h6">{{ recipe.name }}</v-card-title>
            
            <v-card-text>
              <div class="recipe-meta d-flex align-center mb-2">
                <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
                <span class="text-body-2 mr-4">{{ formatTime(recipe.prep_time, recipe.cook_time) }}</span>
                <v-icon size="16" class="mr-1" v-if="recipe.servings">mdi-account-multiple</v-icon>
                <span class="text-body-2" v-if="recipe.servings">{{ recipe.servings }} servings</span>
              </div>
              
              <!-- Dietary Tags -->
              <div class="dietary-tags" v-if="recipe.dietary_tags && recipe.dietary_tags.length > 0">
                <v-chip
                  v-for="tag in recipe.dietary_tags.slice(0, 3)"
                  :key="tag"
                  size="small"
                  color="secondary"
                  class="mr-1 mb-1"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Fallback Static Recipes -->
      <v-row v-else>
        <v-col cols="12" sm="6" md="4" v-for="recipe in staticRecipes" :key="recipe.id">
          <v-card
            class="recipe-preview-card"
            hover
            @click="handleRecipeClick(recipe.id)"
          >
            <div class="recipe-image-placeholder">
              <v-icon size="64" color="grey-lighten-2">mdi-silverware-fork-knife</v-icon>
            </div>

            <!-- Login Overlay for Unauthenticated Users -->
            <div v-if="!isAuthenticated" class="login-overlay">
              <div class="overlay-content">
                <v-icon size="32" color="white" class="mb-2">mdi-lock</v-icon>
                <p class="text-white text-center mb-2">Sign up to view full recipe</p>
                <v-btn
                  color="primary"
                  size="small"
                  @click.stop="$router.push('/register')"
                >
                  Join Now
                </v-btn>
              </div>
            </div>

            <v-card-title class="text-h6">{{ recipe.name }}</v-card-title>
            
            <v-card-text>
              <div class="recipe-meta d-flex align-center mb-2">
                <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
                <span class="text-body-2 mr-4">{{ recipe.time }}</span>
                <v-icon size="16" class="mr-1">mdi-account-multiple</v-icon>
                <span class="text-body-2">{{ recipe.servings }} servings</span>
              </div>
              
              <div class="dietary-tags">
                <v-chip
                  v-for="tag in recipe.tags"
                  :key="tag"
                  size="small"
                  color="secondary"
                  class="mr-1 mb-1"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call to Action -->
    <v-container class="cta-section" v-if="!isAuthenticated">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6" class="text-center">
          <h2 class="text-h4 mb-4">Ready to Start Cooking?</h2>
          <p class="text-body-1 mb-6">
            Join thousands of home cooks creating amazing meals with AI assistance
          </p>
          <v-btn
            color="primary"
            size="large"
            @click="$router.push('/register')"
          >
            Get Started Free Today
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { FeaturedService } from '@/services/featured.service'
import type { Recipe } from '@/services/recipe.service'

const router = useRouter()
const authStore = useAuthStore()
const featuredRecipes = ref<Recipe[]>([])
const isLoading = ref(true)

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Static fallback recipes for demo purposes
const staticRecipes = [
  {
    id: 'demo-1',
    name: 'Mediterranean Quinoa Bowl',
    time: '25 min',
    servings: '2',
    tags: ['Vegetarian', 'Gluten-Free', 'Mediterranean']
  },
  {
    id: 'demo-2', 
    name: 'Spicy Thai Basil Chicken',
    time: '20 min',
    servings: '4',
    tags: ['Thai', 'Spicy', 'High-Protein']
  },
  {
    id: 'demo-3',
    name: 'Vegan Chocolate Avocado Mousse',
    time: '15 min',
    servings: '6',
    tags: ['Vegan', 'Dessert', 'No-Bake']
  }
]

// Format time for display
const formatTime = (prepTime?: number | string, cookTime?: number | string) => {
  if (!prepTime && !cookTime) return '30 min'
  
  const parseTime = (time: number | string) => {
    if (typeof time === 'number') return time
    const match = String(time).match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }
  
  const prep = prepTime ? parseTime(prepTime) : 0
  const cook = cookTime ? parseTime(cookTime) : 0
  const total = prep + cook
  
  if (total === 0) return '30 min'
  if (total < 60) return `${total} min`
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
}

const handleRecipeClick = (recipeId: string | number) => {
  if (!isAuthenticated.value) {
    // Show sign up prompt for unauthenticated users
    router.push('/register')
  } else {
    // Navigate to recipe details for authenticated users
    router.push(`/recipes/${recipeId}`)
  }
}

const loadFeaturedRecipes = async () => {
  try {
    isLoading.value = true
    const recipes = await FeaturedService.getFeaturedRecipes()
    featuredRecipes.value = recipes.slice(0, 6) // Show max 6 recipes
  } catch (error) {
    console.error('Failed to load featured recipes:', error)
    // Will fall back to static recipes
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFeaturedRecipes()
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: white;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.hero-content {
  min-height: 60vh;
}

.hero-buttons {
  margin-top: 2rem;
}

.features-section {
  padding: 4rem 0;
  background-color: rgb(var(--v-theme-surface));
}

.featured-section {
  padding: 4rem 0;
}

.cta-section {
  padding: 4rem 0;
  background-color: rgb(var(--v-theme-surface));
}

.recipe-preview-card {
  position: relative;
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.recipe-preview-card:hover {
  transform: translateY(-4px);
}

.recipe-image-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--v-theme-surface-variant));
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.overlay-content {
  text-align: center;
  padding: 1rem;
}

.recipe-meta {
  color: rgb(var(--v-theme-on-surface-variant));
}

.dietary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
</style>