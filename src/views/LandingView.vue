<template>
  <div class="landing-root">
    <!-- Hero Section -->
    <div class="hero">
      <h1>AI-Powered Recipe Magic</h1>
      <p>Create personalized recipes tailored to your dietary preferences and allergies</p>
      <el-button 
        type="primary" 
        size="large" 
        @click="$router.push('/register')"
        class="hero-btn"
      >
        Get Started Free
      </el-button>
    </div>

    <!-- Featured Recipes Section -->
    <div class="content">
      <h2 class="section-title">Featured Recipes</h2>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>
      
      <!-- Recipe Grid -->
      <div v-else-if="featuredRecipes && featuredRecipes.length > 0" class="recipe-grid">
        <div 
          v-for="recipe in featuredRecipes" 
          :key="recipe.id"
          class="recipe-card"
          @click="viewRecipe(recipe.id)"
        >
          <div class="recipe-image">
            <img 
              v-if="recipe.image_url" 
              :src="recipe.image_url" 
              :alt="recipe.name"
              @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
            >
            <div v-else class="image-placeholder">
              <i class="el-icon-dish"></i>
            </div>
          </div>
          <div class="recipe-content">
            <div class="recipe-title">{{ recipe.name }}</div>
            <div class="recipe-meta">
              <span>⏱ {{ formatTime(recipe.prep_time, recipe.cook_time) }}</span>
              <span v-if="recipe.servings">👥 {{ recipe.servings }} servings</span>
            </div>
            <div v-if="recipe.dietary_preferences && recipe.dietary_preferences.length > 0" class="dietary-tags">
              <span 
                v-for="diet in recipe.dietary_preferences.slice(0, 3)" 
                :key="diet"
                class="tag"
              >
                {{ diet }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fallback to Placeholder -->
      <div v-else class="recipe-grid">
        <div class="recipe-card">
          <div class="recipe-image">[Recipe Image]</div>
          <div class="recipe-content">
            <div class="recipe-title">Mediterranean Quinoa Bowl</div>
            <div class="recipe-meta">
              <span>⏱ 30 min</span>
              <span>👥 4 servings</span>
            </div>
            <div class="dietary-tags">
              <span class="tag">Vegan</span>
              <span class="tag">Gluten-Free</span>
            </div>
          </div>
        </div>
        <div class="recipe-card">
          <div class="recipe-image">[Recipe Image]</div>
          <div class="recipe-content">
            <div class="recipe-title">Thai Coconut Curry</div>
            <div class="recipe-meta">
              <span>⏱ 45 min</span>
              <span>👥 6 servings</span>
            </div>
            <div class="dietary-tags">
              <span class="tag">Vegetarian</span>
              <span class="tag">Dairy-Free</span>
            </div>
          </div>
        </div>
        <div class="recipe-card">
          <div class="recipe-image">[Recipe Image]</div>
          <div class="recipe-content">
            <div class="recipe-title">Zucchini Pasta Primavera</div>
            <div class="recipe-meta">
              <span>⏱ 25 min</span>
              <span>👥 2 servings</span>
            </div>
            <div class="dietary-tags">
              <span class="tag">Keto</span>
              <span class="tag">Low-Carb</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FeaturedService } from '@/services/featured.service'
import type { Recipe } from '@/services/recipe.service'

const router = useRouter()
const featuredRecipes = ref<Recipe[]>([])
const isLoading = ref(true)

// Format time for display
const formatTime = (prepTime?: number | string, cookTime?: number | string) => {
  if (!prepTime && !cookTime) return '30 min'
  
  const parseTime = (time: number | string) => {
    if (typeof time === 'number') return time
    const match = time.match(/(\d+)/)
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

// Load featured recipes
const loadFeaturedRecipes = async () => {
  try {
    isLoading.value = true
    const response = await FeaturedService.getFeaturedRecipes(6)
    featuredRecipes.value = response?.recipes || []
  } catch (error) {
    console.error('Failed to load featured recipes:', error)
    // Set empty array if loading fails
    featuredRecipes.value = []
  } finally {
    isLoading.value = false
  }
}

// Navigate to recipe detail
const viewRecipe = (recipeId: string) => {
  router.push(`/recipes/${recipeId}`)
}

onMounted(() => {
  loadFeaturedRecipes()
})
</script>

<style scoped>
.landing-root {
  width: 100%;
  min-height: 100vh;
}

/* Hero section matching wireframe */
.hero {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-btn {
  padding: 12px 30px;
  font-size: 1rem;
}

/* Content section */
.content {
  padding: 40px 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #2c3e50;
}

/* Recipe cards matching wireframe */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.recipe-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  cursor: pointer;
}

.recipe-image {
  width: 100%;
  height: 200px;
  background: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #95a5a6;
  font-size: 1rem;
  overflow: hidden;
  position: relative;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 3rem;
  color: #bdc3c7;
}

.loading-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.recipe-content {
  padding: 20px;
}

.recipe-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2c3e50;
}

.recipe-meta {
  display: flex;
  gap: 15px;
  color: #7f8c8d;
  font-size: 0.875rem;
  margin-bottom: 10px;
}

.dietary-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.tag {
  background: #e8f4f8;
  color: #2c3e50;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .content {
    padding: 20px 15px;
  }
  
  .recipe-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style> 