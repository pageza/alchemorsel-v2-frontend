<template>
  <div class="recipe-create">
    <h1>Create Recipe</h1>
    <form @submit.prevent="handleSubmit" class="recipe-form">
      <div class="form-group">
        <label for="query">What would you like to cook?</label>
        <textarea
          id="query"
          v-model="query"
          placeholder="Describe the recipe you want to create..."
          required
        ></textarea>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Generating...' : 'Generate Recipe' }}
      </button>
    </form>

    <!-- Recipe Display -->
    <div v-if="recipe" class="recipe-display">
      <h2>{{ recipe.name }}</h2>
      <p class="description">{{ recipe.description }}</p>
      
      <div class="recipe-meta">
        <span>Prep Time: {{ recipe.prep_time }}</span>
        <span>Cook Time: {{ recipe.cook_time }}</span>
        <span>Servings: {{ recipe.servings }}</span>
        <span>Difficulty: {{ recipe.difficulty }}</span>
      </div>

      <div class="recipe-macros">
        <div class="macro">
          <span class="value">{{ recipe.calories }}</span>
          <span class="label">Calories</span>
        </div>
        <div class="macro">
          <span class="value">{{ recipe.protein }}g</span>
          <span class="label">Protein</span>
        </div>
        <div class="macro">
          <span class="value">{{ recipe.carbs }}g</span>
          <span class="label">Carbs</span>
        </div>
        <div class="macro">
          <span class="value">{{ recipe.fat }}g</span>
          <span class="label">Fat</span>
        </div>
      </div>

      <div class="recipe-section">
        <h3>Ingredients</h3>
        <ul>
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </div>

      <div class="recipe-section">
        <h3>Instructions</h3>
        <ol>
          <li v-for="(instruction, index) in recipe.instructions" :key="index">
            {{ instruction }}
          </li>
        </ol>
      </div>

      <div class="recipe-actions">
        <button @click="openModifyModal" class="modify-btn">Modify Recipe</button>
        <button @click="saveRecipe" class="save-btn" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Recipe' }}
        </button>
      </div>
    </div>

    <!-- Modify Recipe Modal -->
    <div v-if="showModifyModal" class="modal">
      <div class="modal-content">
        <h2>Modify Recipe</h2>
        <p>Describe how you'd like to modify the recipe:</p>
        <textarea
          v-model="modifyQuery"
          placeholder="e.g., Make it spicier, add more protein, reduce cooking time..."
          rows="4"
        ></textarea>
        <div class="modal-actions">
          <button @click="handleModify" :disabled="modifying">
            {{ modifying ? 'Modifying...' : 'Apply Changes' }}
          </button>
          <button @click="closeModifyModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { recipeService, llmService } from "@/services/api";
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const authStore = useAuthStore();
const query = ref('')
const recipe = ref(null)
const loading = ref(false)
const saving = ref(false)
const showModifyModal = ref(false)
const modifyQuery = ref('')
const modifying = ref(false)
const draftId = ref(null)

const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await llmService.generateRecipe(query.value)
    recipe.value = response.recipe
    draftId.value = response.draft_id
  } catch (error) {
    console.error('Error generating recipe:', error)
    if (error instanceof Error) {
      alert(error.message)
    } else {
      alert('Failed to generate recipe. Please try again.')
    }
  } finally {
    loading.value = false
  }
}

const openModifyModal = () => {
  showModifyModal.value = true
  modifyQuery.value = ''
}

const closeModifyModal = () => {
  showModifyModal.value = false
  modifyQuery.value = ''
}

const handleModify = async () => {
  if (!modifyQuery.value.trim()) {
    alert('Please describe how you want to modify the recipe.')
    return
  }

  modifying.value = true
  try {
    const response = await llmService.modifyRecipe(modifyQuery.value, draftId.value)
    recipe.value = response.recipe
    closeModifyModal()
  } catch (error) {
    console.error('Error modifying recipe:', error)
    alert('Failed to modify recipe. Please try again.')
  } finally {
    modifying.value = false
  }
}

const saveRecipe = async () => {
  if (!recipe.value) return

  saving.value = true
  try {
    await recipeService.createRecipe(recipe.value)
    router.push('/recipes')
  } catch (error) {
    console.error('Error saving recipe:', error)
    alert('Failed to save recipe. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.recipe-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.recipe-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.recipe-display {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.recipe-meta {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.recipe-macros {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
}

.macro {
  text-align: center;
}

.macro .value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.macro .label {
  font-size: 0.875rem;
  color: #666;
}

.recipe-section {
  margin: 1.5rem 0;
}

.recipe-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.recipe-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.modify-btn {
  background-color: #2196F3;
}

.save-btn {
  background-color: #4CAF50;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn {
  background-color: #f44336;
}
</style>     