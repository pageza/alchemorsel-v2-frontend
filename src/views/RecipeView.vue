<template>
  <div class="recipe-view">
    <div class="recipe-header">
      <h1>Recipes</h1>
      <div class="recipe-actions">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search recipes..." 
          class="search-input"
          @input="handleSearch"
        />
        <button @click="createRecipe" class="create-button">Create Recipe</button>
      </div>
    </div>

    <div class="recipe-filters">
      <select v-model="selectedCategory" @change="handleFilter">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <select v-model="sortBy" @change="handleSort">
        <option value="name">Sort by Name</option>
        <option value="created_at">Sort by Date</option>
        <option value="rating">Sort by Rating</option>
      </select>
    </div>

    <div class="recipe-grid">
      <div v-if="loading" class="loading">Loading recipes...</div>
      <div v-else-if="recipes.length === 0" class="no-recipes">
        No recipes found. Start by creating one!
      </div>
      <div v-else class="recipe-list">
        <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
          <img :src="recipe.image_url || '/default-recipe.jpg'" :alt="recipe.name" class="recipe-image" />
          <div class="recipe-info">
            <h3>{{ recipe.name }}</h3>
            <p class="recipe-description">{{ recipe.description }}</p>
            <div class="recipe-meta">
              <span class="recipe-category">{{ recipe.category }}</span>
              <span class="recipe-rating">★ {{ recipe.rating }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)"
        class="pagination-button"
      >
        Previous
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages" 
        @click="changePage(currentPage + 1)"
        class="pagination-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface Recipe {
  id: string | number
  name: string
  description: string
  category: string
  rating: number
  image_url?: string
}

const router = useRouter()
const recipes = ref<Recipe[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const totalPages = ref(1)
const categories = ref(['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'])

const fetchRecipes = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await axios.get('/api/v1/recipes', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: currentPage.value,
        search: searchQuery.value,
        category: selectedCategory.value,
        sort: sortBy.value
      }
    })

    recipes.value = response.data.recipes
    totalPages.value = response.data.total_pages
  } catch (error: any) {
    console.error('Error fetching recipes:', error)
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchRecipes()
}

const handleFilter = () => {
  currentPage.value = 1
  fetchRecipes()
}

const handleSort = () => {
  fetchRecipes()
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchRecipes()
}

const createRecipe = () => {
  router.push('/recipes/create')
}

onMounted(() => {
  fetchRecipes()
})
</script>

<style scoped>
.recipe-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.recipe-actions {
  display: flex;
  gap: 10px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.create-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #45a049;
}

.recipe-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.recipe-filters select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.recipe-grid {
  margin-top: 20px;
}

.recipe-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.recipe-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recipe-info {
  padding: 15px;
}

.recipe-description {
  color: #666;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.recipe-category {
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.recipe-rating {
  color: #ffc107;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

.loading, .no-recipes {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style> 