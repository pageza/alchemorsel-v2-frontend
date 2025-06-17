<template>
  <div class="dashboard">
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
      <div class="recipe-grid" v-if="recentFavorites.length > 0">
        <RecipeCard 
          v-for="recipe in recentFavorites" 
          :key="recipe.id"
          :image="recipe.image_url || '/placeholder-recipe.jpg'"
          :name="recipe.name"
          @click="$router.push(`/recipes/${recipe.id}`)"
        />
      </div>
      <div v-else class="empty-state">
        <h3>No favorites yet</h3>
        <p>Start exploring recipes and add them to your favorites!</p>
        <el-button type="primary" @click="$router.push('/recipes')">
          Browse Recipes
        </el-button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <!-- Generate button hidden per TODO.md UI/UX improvement -->
      <!-- Users can access recipe generation via navigation menu -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { DashboardService } from '@/services/dashboard.service'
import type { DashboardStats } from '@/services/dashboard.service'
import RecipeCard from '@/components/RecipeCard.vue'
import type { Recipe } from '@/types/recipe.types'
import { useNotificationStore } from '@/stores/notification.store'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const user = ref(authStore.user)
const recentFavorites = ref<Recipe[]>([])
const isLoading = ref(true)

const stats = ref<DashboardStats>({
  recipesGenerated: 0,
  favorites: 0,
  thisWeek: 0,
  primaryDiet: 'None'
})

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
.dashboard {
  width: 100%;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
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

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
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