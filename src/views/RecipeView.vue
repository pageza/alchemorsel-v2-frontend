<template>
  <div class="recipes">
    <div class="recipes__header">
      <h1>Recipes</h1>
      <div class="recipes__search">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search recipes..." 
          class="search-input"
        />
        <router-link to="/recipes/create" class="btn btn-primary">
          Create Recipe
        </router-link>
      </div>
    </div>

    <div class="recipes__filters">
      <select v-model="selectedCategory" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="recipes__loading">
      <div class="loading-spinner"></div>
      <p>Loading recipes...</p>
    </div>

    <div v-else-if="error" class="recipes__error">
      <p>{{ error }}</p>
      <button @click="fetchRecipes" class="btn btn-primary">Try Again</button>
    </div>

    <div v-else-if="filteredRecipes.length === 0" class="recipes__empty">
      <h3>No recipes found</h3>
      <p v-if="searchQuery">Try adjusting your search terms</p>
      <p v-else>Get started by creating your first recipe!</p>
      <router-link to="/recipes/create" class="btn btn-primary">Create Recipe</router-link>
    </div>

    <div v-else class="recipes__grid">
      <div v-for="recipe in paginatedRecipes" :key="recipe.id" class="recipe-card">
        <div class="recipe-card__image">
          <img :src="recipe.image || '/placeholder-recipe.jpg'" :alt="recipe.name" />
        </div>
        <div class="recipe-card__content">
          <h3>{{ recipe.name }}</h3>
          <p>{{ recipe.description }}</p>
          <div class="recipe-card__meta">
            <span class="category">{{ recipe.category }}</span>
            <span class="ingredients">{{ recipe.ingredients?.length || 0 }} ingredients</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="recipes__pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="currentPage--"
        class="btn btn-secondary"
      >
        Previous
      </button>
      
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <button 
        :disabled="currentPage === totalPages" 
        @click="currentPage++"
        class="btn btn-secondary"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { recipeService } from '@/services/api'

interface Recipe {
  id: string
  name: string
  description: string
  category: string
  image?: string
  ingredients?: string[]
  created_at: string
}

const router = useRouter()
const recipes = ref<Recipe[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages']

const filteredRecipes = computed(() => {
  let filtered = recipes.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(recipe => recipe.category === selectedCategory.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredRecipes.value.length / itemsPerPage))

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRecipes.value.slice(start, end)
})

const fetchRecipes = async () => {
  try {
    loading.value = true
    error.value = ''
    const data = await recipeService.listRecipes()
    recipes.value = data
  } catch (err: any) {
    console.error('Error fetching recipes:', err)
    error.value = err.message || 'Failed to load recipes. Please try again.'
    
    if (err.message?.includes('401') || err.message?.includes('authentication')) {
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecipes()
})
</script>

<style lang="scss" scoped>
.recipes {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
      color: var(--primary-color);
      margin: 0;
    }
  }

  &__search {
    display: flex;
    gap: 1rem;
    align-items: center;

    .search-input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      min-width: 250px;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }
  }

  &__filters {
    margin-bottom: 2rem;

    .filter-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
    }
  }

  &__loading {
    text-align: center;
    padding: 4rem 2rem;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  &__error {
    text-align: center;
    padding: 4rem 2rem;
    color: #dc2626;

    p {
      margin-bottom: 1rem;
    }
  }

  &__empty {
    text-align: center;
    padding: 4rem 2rem;

    h3 {
      color: var(--secondary-color);
      margin-bottom: 1rem;
    }

    p {
      color: #666;
      margin-bottom: 2rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .pagination-info {
      color: #666;
      font-size: 0.9rem;
    }
  }
}

.recipe-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &__image {
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    padding: 1.5rem;

    h3 {
      margin: 0 0 0.5rem 0;
      color: var(--secondary-color);
    }

    p {
      color: #666;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;

    .category {
      background-color: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .ingredients {
      color: #666;
    }
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &-primary {
    background-color: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--primary-color-dark);
    }
  }

  &-secondary {
    background-color: #6c757d;
    color: white;

    &:hover:not(:disabled) {
      background-color: #5a6268;
    }
  }
}

@media (max-width: 768px) {
  .recipes {
    &__header {
      flex-direction: column;
      gap: 1rem;
    }

    &__search {
      width: 100%;
      flex-direction: column;

      .search-input {
        min-width: auto;
        width: 100%;
      }
    }

    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>   