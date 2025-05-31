<template>
  <div class="recipe-create">
    <h1>Create New Recipe</h1>
    <form @submit.prevent="createRecipe" class="recipe-form">
      <div class="form-group">
        <label for="name">Recipe Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="recipe.name" 
          required 
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="recipe.description" 
          required 
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select 
          id="category" 
          v-model="recipe.category" 
          required 
          class="form-control"
        >
          <option value="">Select a category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="ingredients">Ingredients</label>
        <div class="ingredients-list">
          <div v-for="(_, index) in recipe.ingredients" :key="index" class="ingredient-item">
            <input 
              type="text" 
              v-model="recipe.ingredients[index]" 
              class="form-control"
              placeholder="Enter ingredient"
            />
            <button 
              type="button" 
              @click="removeIngredient(index)" 
              class="remove-button"
            >
              Remove
            </button>
          </div>
        </div>
        <button 
          type="button" 
          @click="addIngredient" 
          class="add-button"
        >
          Add Ingredient
        </button>
      </div>

      <div class="form-group">
        <label for="instructions">Instructions</label>
        <div class="instructions-list">
          <div v-for="(_, index) in recipe.instructions" :key="index" class="instruction-item">
            <textarea 
              v-model="recipe.instructions[index]" 
              class="form-control"
              rows="2"
              placeholder="Enter step"
            ></textarea>
            <button 
              type="button" 
              @click="removeInstruction(index)" 
              class="remove-button"
            >
              Remove
            </button>
          </div>
        </div>
        <button 
          type="button" 
          @click="addInstruction" 
          class="add-button"
        >
          Add Step
        </button>
      </div>

      <div class="form-group">
        <label for="image">Recipe Image</label>
        <input 
          type="file" 
          id="image" 
          @change="handleImageUpload" 
          accept="image/*"
          class="form-control"
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Creating...' : 'Create Recipe' }}
        </button>
        <button type="button" @click="cancel" class="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface Recipe {
  name: string
  description: string
  category: string
  ingredients: string[]
  instructions: string[]
  image?: File
}

const router = useRouter()
const loading = ref(false)
const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks']

const recipe = ref<Recipe>({
  name: '',
  description: '',
  category: '',
  ingredients: [''],
  instructions: ['']
})

const addIngredient = () => {
  recipe.value.ingredients.push('')
}

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1)
}

const addInstruction = () => {
  recipe.value.instructions.push('')
}

const removeInstruction = (index: number) => {
  recipe.value.instructions.splice(index, 1)
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    recipe.value.image = target.files[0]
  }
}

const createRecipe = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const formData = new FormData()
    formData.append('name', recipe.value.name)
    formData.append('description', recipe.value.description)
    formData.append('category', recipe.value.category)
    formData.append('ingredients', JSON.stringify(recipe.value.ingredients))
    formData.append('instructions', JSON.stringify(recipe.value.instructions))
    if (recipe.value.image) {
      formData.append('image', recipe.value.image)
    }

    await axios.post('/api/v1/recipes', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    router.push('/recipes')
  } catch (error: any) {
    console.error('Error creating recipe:', error)
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  router.push('/recipes')
}
</script>

<style scoped>
.recipe-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.recipe-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.ingredients-list,
.instructions-list {
  margin-bottom: 10px;
}

.ingredient-item,
.instruction-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c82333;
}

.add-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-button:hover {
  background-color: #5a6268;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.cancel-button:hover {
  background-color: #5a6268;
}
</style> 