<template>
  <div>
    <v-container class="py-8">
      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <!-- Profile Header -->
          <v-card class="mb-6">
            <v-card-text class="pa-6">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-avatar
                    :image="user?.profile?.profile_picture_url || '/default-avatar.png'"
                    size="100"
                    class="mr-6"
                  >
                    <v-icon v-if="!user?.profile?.profile_picture_url" size="50">mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <h1 class="text-h4 font-weight-bold mb-2">{{ user?.name || user?.username || 'User' }}</h1>
                    <p class="text-h6 text-medium-emphasis mb-1">@{{ user?.username || 'username' }}</p>
                    <p class="text-body-1 text-medium-emphasis">{{ user?.email }}</p>
                    <v-chip
                      v-if="user?.role !== 'user'"
                      :color="user?.role === 'admin' ? 'error' : 'warning'"
                      size="small"
                      class="mt-2"
                    >
                      {{ user?.role?.toUpperCase() }}
                    </v-chip>
                  </div>
                </div>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-pencil"
                  @click="$router.push('/profile/edit')"
                >
                  Edit Profile
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Bio Section -->
          <v-card v-if="user?.bio" class="mb-6">
            <v-card-title class="text-h5 font-weight-bold">About</v-card-title>
            <v-card-text>
              <p class="text-body-1">{{ user.bio }}</p>
            </v-card-text>
          </v-card>

          <!-- Stats Section -->
          <v-card class="mb-6">
            <v-card-title class="text-h5 font-weight-bold">Statistics</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" md="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-primary">{{ stats.recipesGenerated }}</div>
                    <div class="text-body-2 text-medium-emphasis">Recipes Created</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-secondary">{{ stats.favorites }}</div>
                    <div class="text-body-2 text-medium-emphasis">Favorites</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-success">{{ stats.thisWeek }}</div>
                    <div class="text-body-2 text-medium-emphasis">This Week</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-warning">{{ memberSince }}</div>
                    <div class="text-body-2 text-medium-emphasis">Member Since</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Dietary Lifestyles -->
          <v-card v-if="user?.dietary_lifestyles?.length" class="mb-6">
            <v-card-title class="text-h5 font-weight-bold">Dietary Lifestyles</v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="lifestyle in user.dietary_lifestyles"
                  :key="lifestyle"
                  color="primary"
                  variant="tonal"
                >
                  {{ formatDietaryPreference(lifestyle) }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Cuisine Preferences -->
          <v-card v-if="user?.cuisine_preferences?.length" class="mb-6">
            <v-card-title class="text-h5 font-weight-bold">Favorite Cuisines</v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="cuisine in user.cuisine_preferences"
                  :key="cuisine"
                  color="secondary"
                  variant="tonal"
                >
                  {{ formatDietaryPreference(cuisine) }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Food Allergies -->
          <v-card v-if="user?.allergens?.length" class="mb-6">
            <v-card-title class="text-h5 font-weight-bold">Food Allergies</v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="allergen in user.allergens"
                  :key="allergen.id"
                  color="error"
                  variant="tonal"
                >
                  {{ allergen.allergen_name }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Admin Dashboard Link -->
          <v-card v-if="user?.role === 'admin' || user?.role === 'moderator'" class="mb-6">
            <v-card-title class="text-h5 font-weight-bold">Administrative Tools</v-card-title>
            <v-card-text>
              <v-btn
                color="error"
                prepend-icon="mdi-shield-account"
                size="large"
                @click="$router.push('/admin')"
              >
                Access Admin Dashboard
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Recent Activity -->
          <v-card>
            <v-card-title class="text-h5 font-weight-bold">Recent Activity</v-card-title>
            <v-card-text>
              <div v-if="recentRecipes.length > 0">
                <h3 class="text-h6 mb-3">Recently Created Recipes</h3>
                <v-row>
                  <v-col
                    v-for="recipe in recentRecipes.slice(0, 3)"
                    :key="recipe.id"
                    cols="12"
                    md="4"
                  >
                    <v-card
                      :to="`/recipes/${recipe.id}`"
                      class="h-100"
                      elevation="2"
                      hover
                    >
                      <v-img
                        :src="recipe.image_url || '/placeholder-recipe.jpg'"
                        height="200"
                        cover
                      ></v-img>
                      <v-card-title class="text-h6">{{ recipe.name }}</v-card-title>
                      <v-card-subtitle>{{ formatDate(recipe.created_at) }}</v-card-subtitle>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
              <div v-else class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chef-hat</v-icon>
                <h3 class="text-h6 mb-2">No recipes yet</h3>
                <p class="text-body-1 text-medium-emphasis mb-4">Start creating delicious recipes!</p>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-robot"
                  @click="$router.push('/generate')"
                >
                  Generate Recipe with AI
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { DashboardService } from '@/services/dashboard.service'
import { UserService } from '@/services/user.service'
import type { Recipe } from '@/types/recipe.types'
import type { DashboardStats } from '@/services/dashboard.service'
import { useNotificationStore } from '@/stores/notification.store'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const user = ref(authStore.user)
const stats = ref<DashboardStats>({
  recipesGenerated: 0,
  favorites: 0,
  thisWeek: 0,
  primaryDiet: 'None'
})
const recentRecipes = ref<Recipe[]>([])
const isLoading = ref(true)

const memberSince = computed(() => {
  if (!user.value?.created_at) return 'N/A'
  return new Date(user.value.created_at).getFullYear().toString()
})

const formatDietaryPreference = (pref: string) => {
  return pref.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    isLoading.value = true
    
    // Load user profile and dashboard data
    const [userProfile, dashboardStats, userRecipes] = await Promise.all([
      UserService.getProfile().catch(() => authStore.user), // Fallback to store user
      DashboardService.getStats().catch(() => ({
        recipesGenerated: 0,
        favorites: 0,
        thisWeek: 0,
        primaryDiet: 'None'
      })),
      DashboardService.getRecentFavorites().catch(() => []) // This gets recent favorites, we'll use it as placeholder
    ])
    
    user.value = userProfile || authStore.user
    stats.value = dashboardStats
    recentRecipes.value = userRecipes
    
  } catch (error) {
    console.error('Failed to load profile data:', error)
    notificationStore.error('Failed to load profile data')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.gap-2 > * {
  margin: 0 4px 4px 0;
}
</style>