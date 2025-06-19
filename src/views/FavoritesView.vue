<template>
  <div class="favorites">
    <div class="favorites-header">
      <h1>My Favorites</h1>
      <p class="subtitle">Your collection of favorite recipes</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your favorites...</p>
    </div>

    <!-- Favorites Grid -->
    <div v-else-if="favorites.length > 0" class="favorites-content">
      <div class="results-info">
        <p>{{ favorites.length }} favorite{{ favorites.length !== 1 ? 's' : '' }}</p>
      </div>
      
      <div class="recipe-grid">
        <RecipeCard 
          v-for="recipe in favorites" 
          :key="recipe.id"
          :id="recipe.id"
          :image="recipe.image_url || '/placeholder-recipe.jpg'"
          :name="recipe.name"
          :showFavoriteButton="true"
          :isFavorite="true"
          @click="$router.push(`/recipes/${recipe.id}`)"
          @favoriteToggle="handleFavoriteToggle"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">❤️</div>
      <h3>No favorites yet</h3>
      <p>Discover amazing recipes and add them to your favorites to see them here.</p>
      <el-button 
        type="primary" 
        size="large"
        @click="$router.push('/recipes')"
      >
        Browse Recipes
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRecipeStore } from '@/stores/recipe.store'
import { useNotificationStore } from '@/stores/notification.store'
import { RecipeService } from '@/services/recipe.service'
import RecipeCard from '@/components/RecipeCard.vue'
import type { Recipe } from '@/types/recipe.types'

const recipeStore = useRecipeStore()
const notificationStore = useNotificationStore()

const favorites = ref<Recipe[]>([])
const loading = ref(true)

const handleFavoriteToggle = async (recipeId: string) => {
  try {
    // Remove from favorites locally immediately for better UX
    favorites.value = favorites.value.filter(recipe => recipe.id !== recipeId)
    
    // Call the store method to update backend
    await recipeStore.toggleFavorite(recipeId, true) // true because it's currently favorited
    
    notificationStore.success('Recipe removed from favorites')
  } catch {
    // Re-add the recipe if the API call failed
    notificationStore.error('Failed to update favorites')
    loadFavorites() // Reload to get correct state
  }
}

const loadFavorites = async () => {
  try {
    loading.value = true
    favorites.value = await RecipeService.getFavorites()
  } catch (error) {
    console.error('Failed to load favorites:', error)
    notificationStore.error('Failed to load favorites')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.favorites {
  width: 100%;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.favorites-header {
  margin-bottom: 40px;
}

.favorites-header h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.favorites-content {
  margin-top: 20px;
}

.results-info {
  margin-bottom: 20px;
  color: #7f8c8d;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #95a5a6;
}

.empty-state p {
  font-size: 1rem;
  margin-bottom: 30px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .favorites {
    padding: 20px 15px;
  }
  
  .favorites-header h1 {
    font-size: 1.75rem;
  }
  
  .recipe-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>