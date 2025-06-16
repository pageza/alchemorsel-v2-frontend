<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Welcome back, {{ user?.name || 'User' }}!</h1>
    </div>

    <!-- Dashboard Stats -->
    <div class="dashboard-stats">
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
      <el-button 
        type="primary" 
        size="large"
        @click="$router.push('/generate')"
      >
        Generate New Recipe
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
// import { useRecipeStore } from '@/stores/recipe.store'
import RecipeCard from '@/components/RecipeCard.vue'
import type { Recipe } from '@/types/recipe.types'

const authStore = useAuthStore()
// const recipeStore = useRecipeStore() // TODO: Use this when implementing recipe functionality

const user = ref(authStore.user)
const recentFavorites = ref<Recipe[]>([])

const stats = ref({
  recipesGenerated: 12,
  favorites: 24,
  thisWeek: 3,
  primaryDiet: 'Vegan'
})

onMounted(async () => {
  // Load user's favorite recipes
  try {
    // This would typically fetch from the backend
    // For now, we'll use empty array until backend integration
    recentFavorites.value = []
  } catch (error) {
    console.error('Failed to load favorites:', error)
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
</style>