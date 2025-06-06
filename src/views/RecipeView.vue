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
          @input="handleSearch"
        />
        <router-link to="/recipes/create" class="btn btn-primary">
          Create Recipe
        </router-link>
      </div>
    </div>

    <!-- Search Results Modal -->
    <div v-if="showSearchModal" class="search-modal">
      <div class="search-modal__content">
        <div class="search-modal__header">
          <h2>Search Results</h2>
          <button @click="showSearchModal = false" class="btn btn-icon">×</button>
        </div>
        
        <div v-if="searchLoading" class="search-modal__loading">
          <div class="loading-spinner"></div>
          <p>Searching recipes...</p>
        </div>

        <div v-else-if="searchError" class="search-modal__error">
          <p>{{ searchError }}</p>
        </div>

        <div v-else-if="searchResults.length === 0" class="search-modal__empty">
          <h3>No exact matches found</h3>
          <p>Would you like to:</p>
          <div class="search-modal__actions">
            <button @click="createNewRecipe" class="btn btn-primary">
              Create New Recipe
            </button>
          </div>
        </div>

        <div v-else class="search-modal__results">
          <h3>Found {{ searchResults.length }} similar recipes</h3>
          <div class="search-modal__list">
            <div 
              v-for="recipe in searchResults" 
              :key="recipe.id" 
              class="search-modal__item"
            >
              <div class="search-modal__item-content">
                <h4>{{ recipe.name }}</h4>
                <p>{{ recipe.description }}</p>
                <div class="search-modal__item-meta">
                  <span class="category">{{ recipe.category }}</span>
                  <span class="ingredients">{{ recipe.ingredients?.length || 0 }} ingredients</span>
                </div>
              </div>
              <div class="search-modal__item-actions">
                <button @click="viewRecipe(recipe)" class="btn btn-secondary">
                  View
                </button>
                <button @click="modifyRecipe(recipe)" class="btn btn-primary">
                  Modify
                </button>
              </div>
            </div>
          </div>
          <div class="search-modal__actions">
            <button @click="createNewRecipe" class="btn btn-primary">
              Create New Recipe
            </button>
          </div>
        </div>
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
      <div 
        v-for="recipe in paginatedRecipes" 
        :key="recipe.id" 
        class="recipe-card"
        @click="router.push({ name: 'RecipeDetail', params: { id: recipe.id }})"
      >
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
import { recipeService, llmService } from '@/services/api'
import { useDebounce } from '@/composables/useDebounce'

interface Recipe {
  id: string
  name: string
  description: string
  category: string
  image?: string
  ingredients?: string[]
  created_at: string
  tags?: string[]
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

const showSearchModal = ref(false)
const searchResults = ref<Recipe[]>([])
const searchLoading = ref(false)
const searchError = ref('')

const filteredRecipes = computed(() => {
  console.log('filteredRecipes - recipes.value:', recipes.value)
  let filtered = Array.isArray(recipes.value) ? recipes.value : []
  console.log('filteredRecipes - initial filtered:', filtered)

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

  console.log('filteredRecipes - final filtered:', filtered)
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredRecipes.value.length / itemsPerPage))

const paginatedRecipes = computed(() => {
  console.log('paginatedRecipes - filteredRecipes.value:', filteredRecipes.value)
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  const recipes = Array.isArray(filteredRecipes.value) ? filteredRecipes.value : []
  console.log('paginatedRecipes - recipes to slice:', recipes)
  return recipes.slice(start, end)
})

const fetchRecipes = async () => {
  try {
    loading.value = true
    error.value = ''
    const data = await recipeService.listRecipes()
    console.log('API Response:', data)
    recipes.value = Array.isArray(data.recipes) ? data.recipes : []
    console.log('recipes.value after assignment:', recipes.value)
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

const debouncedSearch = useDebounce(async (query: string) => {
  if (!query.trim()) {
    showSearchModal.value = false
    return
  }

  try {
    searchLoading.value = true
    searchError.value = ''
    const response = await recipeService.searchRecipes(query)
    searchResults.value = response.recipes || []
    showSearchModal.value = true
  } catch (err: any) {
    searchError.value = err.message || 'Failed to search recipes'
  } finally {
    searchLoading.value = false
  }
}, 300)

const handleSearch = () => {
  debouncedSearch(searchQuery.value)
}

const viewRecipe = (recipe: Recipe) => {
  showSearchModal.value = false
  router.push({ name: 'RecipeDetail', params: { id: recipe.id } })
}

const modifyRecipe = async (recipe: Recipe) => {
  showSearchModal.value = false
  try {
    const { recipe: modifiedRecipe, draft_id } = await llmService.modifyRecipe(
      `Modify this recipe: ${recipe.name}`,
      recipe.id
    )
    router.push({ 
      name: 'RecipeCreate',
      query: { 
        draft_id,
        mode: 'modify'
      }
    })
  } catch (err: any) {
    error.value = err.message || 'Failed to modify recipe'
  }
}

const createNewRecipe = () => {
  showSearchModal.value = false
  router.push({ name: 'RecipeCreate' })
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
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;

    .category {
      background-color: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      align-self: flex-start;
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

.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &__content {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h2 {
      margin: 0;
      color: var(--primary-color);
    }
  }

  &__loading,
  &__error,
  &__empty {
    text-align: center;
    padding: 2rem;
  }

  &__list {
    margin: 1rem 0;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-bottom: 1rem;

    &-content {
      flex: 1;

      h4 {
        margin: 0 0 0.5rem;
        color: var(--primary-color);
      }

      p {
        margin: 0 0 0.5rem;
        color: #666;
      }
    }

    &-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.9rem;
      color: #666;
    }

    &-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  &__actions {
    margin-top: 1.5rem;
    text-align: center;
  }
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;

  &:hover {
    color: var(--primary-color);
  }
}
</style>   