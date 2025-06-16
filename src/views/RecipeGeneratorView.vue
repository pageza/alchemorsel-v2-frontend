<template>
  <div class="recipe-generator">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-h3 font-weight-bold mb-4">AI Recipe Generator</h1>
            <p class="text-h6 text-medium-emphasis">
              Describe what you want to cook and let AI create a personalized recipe for you
            </p>
          </div>

          <!-- Input Form -->
          <v-card class="mb-6">
            <v-card-text class="pa-6">
              <v-form @submit.prevent="generateRecipe">
                <v-textarea
                  v-model="query"
                  label="What would you like to cook?"
                  placeholder="Try: 'Spicy chicken dinner', 'Vegan Japanese-Mexican fusion lunch', 'Quick healthy breakfast'..."
                  rows="3"
                  variant="outlined"
                  :disabled="isLoading"
                  class="mb-4"
                ></v-textarea>
                
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  :loading="isLoading"
                  :disabled="!query.trim()"
                  block
                >
                  {{ isLoading ? 'Generating Recipe...' : 'Generate Recipe' }}
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Loading State -->
          <v-card v-if="isLoading" class="text-center pa-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              class="mb-4"
            ></v-progress-circular>
            <h3 class="text-h5 mb-2">Creating your recipe...</h3>
            <p class="text-body-1 text-medium-emphasis">
              Our AI chef is working on something delicious for you
            </p>
          </v-card>

          <!-- Error State -->
          <v-alert
            v-if="error"
            type="error"
            class="mb-6"
            closable
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>

          <!-- Generated Recipe Display -->
          <v-card v-if="currentDraft" class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="success">mdi-chef-hat</v-icon>
              {{ currentDraft.name }}
            </v-card-title>
            
            <v-card-text>
              <p class="text-body-1 mb-4">{{ currentDraft.description }}</p>
              
              <!-- Recipe Meta Info -->
              <div class="d-flex flex-wrap gap-2 mb-4">
                <v-chip color="primary" size="small">
                  <v-icon start>mdi-clock-outline</v-icon>
                  {{ currentDraft.prep_time }} prep + {{ currentDraft.cook_time }} cook
                </v-chip>
                <v-chip color="secondary" size="small">
                  <v-icon start>mdi-account-group</v-icon>
                  {{ currentDraft.servings.Value }} servings
                </v-chip>
                <v-chip color="accent" size="small">
                  <v-icon start>mdi-chart-line</v-icon>
                  {{ currentDraft.difficulty }}
                </v-chip>
                <v-chip color="orange" size="small">
                  <v-icon start>mdi-fire</v-icon>
                  {{ Math.round(currentDraft.calories) }} cal
                </v-chip>
              </div>

              <!-- Ingredients -->
              <div class="mb-6">
                <h3 class="text-h6 mb-3">Ingredients</h3>
                <v-list density="compact">
                  <v-list-item
                    v-for="(ingredient, index) in currentDraft.ingredients"
                    :key="index"
                    :prepend-icon="'mdi-circle-small'"
                  >
                    {{ ingredient }}
                  </v-list-item>
                </v-list>
              </div>

              <!-- Instructions -->
              <div class="mb-6">
                <h3 class="text-h6 mb-3">Instructions</h3>
                <v-list>
                  <v-list-item
                    v-for="(instruction, index) in currentDraft.instructions"
                    :key="index"
                    class="mb-2"
                  >
                    <template #prepend>
                      <v-avatar color="primary" size="24" class="mr-3">
                        <span class="text-caption">{{ index + 1 }}</span>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-wrap">
                      {{ instruction }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>

              <!-- Nutrition Info -->
              <div class="mb-6">
                <h3 class="text-h6 mb-3">Nutrition (per serving)</h3>
                <v-row>
                  <v-col cols="3">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">{{ Math.round(currentDraft.calories) }}</div>
                      <div class="text-caption">Calories</div>
                    </div>
                  </v-col>
                  <v-col cols="3">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">{{ Math.round(currentDraft.protein) }}g</div>
                      <div class="text-caption">Protein</div>
                    </div>
                  </v-col>
                  <v-col cols="3">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">{{ Math.round(currentDraft.carbs) }}g</div>
                      <div class="text-caption">Carbs</div>
                    </div>
                  </v-col>
                  <v-col cols="3">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">{{ Math.round(currentDraft.fat) }}g</div>
                      <div class="text-caption">Fat</div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>

            <!-- Action Buttons -->
            <v-card-actions class="pa-4">
              <v-btn
                color="success"
                variant="elevated"
                :loading="isSaving"
                @click="saveRecipe"
              >
                <v-icon start>mdi-content-save</v-icon>
                Save Recipe
              </v-btn>
              
              <v-spacer></v-spacer>
              
              <v-btn
                color="primary"
                variant="outlined"
                @click="showModifyDialog = true"
              >
                <v-icon start>mdi-pencil</v-icon>
                Modify
              </v-btn>
              
              <v-btn
                color="secondary"
                variant="text"
                @click="startOver"
              >
                <v-icon start>mdi-refresh</v-icon>
                Start Over
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- Modification Dialog -->
          <v-dialog v-model="showModifyDialog" max-width="600">
            <v-card>
              <v-card-title>Modify Recipe</v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="modifyQuery"
                  label="How would you like to modify this recipe?"
                  placeholder="Try: 'Make it less spicy', 'Add more vegetables', 'Make it vegan'..."
                  rows="3"
                  variant="outlined"
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="showModifyDialog = false">Cancel</v-btn>
                <v-btn
                  color="primary"
                  :loading="isModifying"
                  :disabled="!modifyQuery.trim()"
                  @click="modifyRecipe"
                >
                  Apply Changes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LLMService, type RecipeDraft } from '@/services/llm.service'
import { RecipeService } from '@/services/recipe.service'

const router = useRouter()

// State
const query = ref('')
const modifyQuery = ref('')
const currentDraft = ref<RecipeDraft | null>(null)
const currentDraftId = ref<string>('')
const isLoading = ref(false)
const isModifying = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)
const showModifyDialog = ref(false)

// Generate recipe from natural language
const generateRecipe = async () => {
  if (!query.value.trim()) return

  isLoading.value = true
  error.value = null

  try {
    const response = await LLMService.generateRecipe(query.value)
    currentDraft.value = response.recipe
    currentDraftId.value = response.draft_id
  } catch (err) {
    error.value = 'Failed to generate recipe. Please try again.'
    console.error('Recipe generation error:', err)
  } finally {
    isLoading.value = false
  }
}

// Modify existing recipe
const modifyRecipe = async () => {
  if (!modifyQuery.value.trim() || !currentDraftId.value) return

  isModifying.value = true
  error.value = null

  try {
    const response = await LLMService.modifyRecipe(modifyQuery.value, currentDraftId.value)
    currentDraft.value = response.recipe
    showModifyDialog.value = false
    modifyQuery.value = ''
  } catch (err) {
    error.value = 'Failed to modify recipe. Please try again.'
    console.error('Recipe modification error:', err)
  } finally {
    isModifying.value = false
  }
}

// Save recipe to permanent collection
const saveRecipe = async () => {
  if (!currentDraft.value) return

  isSaving.value = true
  error.value = null

  try {
    const savedRecipe = await RecipeService.createRecipeFromDraft(currentDraft.value)
    
    // Validate that we have a proper recipe ID before navigating
    if (savedRecipe && savedRecipe.id) {
      console.log('Recipe saved successfully with ID:', savedRecipe.id)
      router.push(`/recipes/${savedRecipe.id}`)
    } else {
      throw new Error('Recipe was saved but no ID was returned')
    }
  } catch (err: any) {
    // Stay on the page and show error - don't lose the generated recipe
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please log in again.'
    } else if (err.response?.status >= 500) {
      error.value = 'Server error occurred while saving. Please try again.'
    } else {
      error.value = err.message || 'Failed to save recipe. Please try again.'
    }
    console.error('Recipe saving error:', err)
    isSaving.value = false
  }
}

// Start over with new generation
const startOver = () => {
  currentDraft.value = null
  currentDraftId.value = ''
  query.value = ''
  modifyQuery.value = ''
  error.value = null
  showModifyDialog.value = false
}
</script>

<style scoped>
.recipe-generator {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.v-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

.v-chip {
  margin: 2px;
}
</style>