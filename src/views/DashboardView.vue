<template>
  <v-container class="py-8">
    <div class="dashboard-header">
      <h1>Welcome back, {{ user?.name || 'User' }}!</h1>
    </div>

    <!-- Dashboard Stats -->
    <div class="dashboard-stats" v-if="!isLoading">
      <div class="stat-card">
        <h3>{{ stats.recipesGenerated }}</h3>
        <p>Recipes Generated</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.favorites }}</h3>
        <p>Favorites</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.thisWeek }}</h3>
        <p>This Week</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.primaryDiet }}</h3>
        <p>Primary Diet</p>
      </div>
    </div>
    
    <!-- Loading state for stats -->
    <div class="dashboard-stats" v-else>
      <div class="stat-card loading" v-for="i in 4" :key="i">
        <div class="skeleton-loader"></div>
      </div>
    </div>

    <!-- Recent Favorites Section -->
    <div class="favorites-section">
      <h2>Recent Favorites</h2>
      <v-row v-if="recentFavorites && recentFavorites.length > 0">
        <v-col
          v-for="recipe in recentFavorites"
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
              :src="recipe.image_url || '/placeholder-recipe.jpg'"
              height="200"
              cover
              class="align-end"
            >
              <v-chip
                v-if="recipe.category"
                class="ma-2"
                color="primary"
                size="small"
              >
                {{ recipe.category }}
              </v-chip>
              <v-btn
                :icon="recipe.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
                :color="recipe.isFavorite ? 'red' : 'white'"
                class="favorite-btn"
                size="small"
                variant="elevated"
                @click.prevent="handleFavoriteToggle(recipe.id)"
              ></v-btn>
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
      <div v-else class="empty-state">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chef-hat</v-icon>
        <h3>No favorites yet</h3>
        <p>Start exploring recipes and add them to your favorites!</p>
        <v-btn
          color="primary"
          prepend-icon="mdi-magnify"
          @click="$router.push('/recipes')"
        >
          Browse Recipes
        </v-btn>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <!-- Generate button hidden per TODO.md UI/UX improvement -->
      <!-- Users can access recipe generation via navigation menu -->
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { DashboardService } from '@/services/dashboard.service'
import type { DashboardStats } from '@/services/dashboard.service'
import type { Recipe } from '@/types/recipe.types'
import { useNotificationStore } from '@/stores/notification.store'
import { useRecipeStore } from '@/stores/recipe.store'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const recipeStore = useRecipeStore()

const user = ref(authStore.user)
const recentFavorites = ref<Recipe[]>([])
const isLoading = ref(true)

const stats = ref<DashboardStats>({
  recipesGenerated: 0,
  favorites: 0,
  thisWeek: 0,
  primaryDiet: 'None'
})

const handleFavoriteToggle = async (recipeId: string) => {
  try {
    // Remove from favorites locally immediately for better UX
    recentFavorites.value = recentFavorites.value.filter(recipe => recipe.id !== recipeId)
    
    // Call the store method to update backend
    await recipeStore.toggleFavorite(recipeId, true) // true because it's currently favorited
    
    notificationStore.success('Recipe removed from favorites')
  } catch {
    // Re-add the recipe if the API call failed
    notificationStore.error('Failed to update favorites')
    // Reload recent favorites to get correct state
    try {
      recentFavorites.value = await DashboardService.getRecentFavorites()
    } catch (error) {
      console.error('Failed to reload favorites:', error)
    }
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    // Load dashboard statistics
    const [statsData, favoritesData] = await Promise.all([
      DashboardService.getStats(),
      DashboardService.getRecentFavorites()
    ])
    
    stats.value = statsData
    recentFavorites.value = favoritesData
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    notificationStore.error('Failed to load dashboard data')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
}

.favorite-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin-bottom: 40px;
  color: #2c3e50;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  font-size: 2.25rem;
  color: #3498db;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.stat-card p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.9rem;
}

.favorites-section {
  margin-bottom: 40px;
}

.favorites-section h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #2c3e50;
}


.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #95a5a6;
}

.empty-state p {
  margin-bottom: 20px;
}

.quick-actions {
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-card h3 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}

/* Loading states */
.stat-card.loading {
  position: relative;
  overflow: hidden;
}

.skeleton-loader {
  width: 100%;
  height: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>