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
            <h3 class="text-h5 mb-2">{{ loadingMessage }}</h3>
            <p class="text-body-1 text-medium-emphasis">
              {{ loadingSubMessage }}
            </p>
            <div v-if="retryAttempt > 1" class="mt-4">
              <v-chip color="warning" size="small">
                <v-icon start size="small">mdi-refresh</v-icon>
                Attempt {{ retryAttempt }} of 3
              </v-chip>
            </div>
          </v-card>

          <!-- Error State -->
          <v-alert v-if="error" type="error" class="mb-6" closable @click:close="error = null">
            <div class="d-flex align-center justify-space-between">
              <div>{{ error }}</div>
              <v-btn
                v-if="error.includes('verify your email') || error.includes('email verification')"
                color="primary"
                variant="outlined"
                size="small"
                @click="resendVerificationEmail"
                :loading="resendingEmail"
                class="ml-3"
              >
                Resend Email
              </v-btn>
            </div>
          </v-alert>

          <!-- Similar Recipes Found -->
          <div v-if="similarRecipes.length > 0" class="mb-6">
            <v-alert type="info" class="mb-4">
              <v-alert-title>Found Similar Recipes!</v-alert-title>
              We found existing recipes that match your request. You can use one of these or
              generate a new variation.
            </v-alert>

            <v-row>
              <v-col v-for="recipe in similarRecipes" :key="recipe.id" cols="12" sm="6" md="4">
                <v-card class="h-100" hover @click="router.push(`/recipes/${recipe.id}`)">
                  <v-card-title>{{ recipe.name }}</v-card-title>
                  <v-card-text>
                    <p class="text-body-2">{{ recipe.description }}</p>
                    <div class="mt-2">
                      <v-chip size="x-small" class="ma-1">
                        <v-icon start size="x-small">mdi-clock-outline</v-icon>
                        {{ recipe.total_time || '30 min' }}
                      </v-chip>
                      <v-chip size="x-small" class="ma-1">
                        <v-icon start size="x-small">mdi-fire</v-icon>
                        {{ recipe.calories || 'N/A' }} cal
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <div class="text-center mt-4">
              <v-btn color="primary" variant="outlined" @click="generateNewVariation">
                Generate New Variation Anyway
              </v-btn>
            </div>
          </div>

          <!-- Generated Recipe Display -->
          <v-card v-if="currentDraft" class="mb-6" elevation="4">
            <v-card-title class="d-flex align-center bg-surface-variant pa-6">
              <v-icon class="mr-3" color="success" size="large">mdi-chef-hat</v-icon>
              <div>
                <div class="text-h5 font-weight-bold">{{ currentDraft.name }}</div>
                <div class="text-body-2 text-medium-emphasis mt-1">AI Generated Recipe</div>
              </div>
            </v-card-title>

            <v-card-text class="pa-6">
              <p class="text-body-1 mb-6 text-medium-emphasis">{{ currentDraft.description }}</p>

              <!-- Recipe Meta Info -->
              <div class="d-flex flex-wrap gap-2 mb-6">
                <v-chip color="primary" size="small" variant="tonal">
                  <v-icon start size="small">mdi-clock-outline</v-icon>
                  {{ currentDraft.prep_time }} prep + {{ currentDraft.cook_time }} cook
                </v-chip>
                <v-chip color="secondary" size="small" variant="tonal">
                  <v-icon start size="small">mdi-account-group</v-icon>
                  {{ currentDraft.servings.Value }} servings
                </v-chip>
                <v-chip color="accent" size="small" variant="tonal">
                  <v-icon start size="small">mdi-chart-line</v-icon>
                  {{ currentDraft.difficulty }}
                </v-chip>
                <v-chip color="orange" size="small" variant="tonal">
                  <v-icon start size="small">mdi-fire</v-icon>
                  {{ Math.round(currentDraft.calories_per_serving || currentDraft.calories) }} cal/serving
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
              <v-card variant="tonal" class="mb-6">
                <v-card-subtitle class="pb-2">
                  <v-icon start size="small">mdi-nutrition</v-icon>
                  Nutrition (per serving)
                </v-card-subtitle>
                <v-card-text class="pt-0">
                  <v-row>
                    <v-col cols="6" sm="3">
                      <div class="text-center">
                        <div class="text-h6 font-weight-bold text-primary">
                          {{ Math.round(currentDraft.calories_per_serving || currentDraft.calories) }}
                        </div>
                        <div class="text-caption text-medium-emphasis">Calories</div>
                      </div>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <div class="text-center">
                        <div class="text-h6 font-weight-bold text-success">
                          {{ Math.round(currentDraft.protein_per_serving || currentDraft.protein) }}g
                        </div>
                        <div class="text-caption text-medium-emphasis">Protein</div>
                      </div>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <div class="text-center">
                        <div class="text-h6 font-weight-bold text-warning">
                          {{ Math.round(currentDraft.carbs_per_serving || currentDraft.carbs) }}g
                        </div>
                        <div class="text-caption text-medium-emphasis">Carbs</div>
                      </div>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <div class="text-center">
                        <div class="text-h6 font-weight-bold text-secondary">
                          {{ Math.round(currentDraft.fat_per_serving || currentDraft.fat) }}g
                        </div>
                        <div class="text-caption text-medium-emphasis">Fat</div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>

            <!-- Action Buttons -->
            <v-card-actions class="pa-6 pt-0">
              <v-btn 
                color="success" 
                variant="elevated" 
                size="large"
                :loading="isSaving" 
                @click="saveRecipe"
                class="mr-3"
              >
                <v-icon start>mdi-content-save</v-icon>
                Save Recipe
              </v-btn>

              <v-btn 
                color="primary" 
                variant="outlined" 
                size="large"
                @click="showModifyDialog = true"
                class="mr-3"
              >
                <v-icon start>mdi-pencil</v-icon>
                Modify
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn 
                color="secondary" 
                variant="text" 
                size="large"
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LLMService, type RecipeDraft } from '@/services/llm.service'
import { RecipeService } from '@/services/recipe.service'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import { AuthService } from '@/services/auth.service'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// State
const query = ref('')
const modifyQuery = ref('')
const currentDraft = ref<RecipeDraft | null>(null)
const currentDraftId = ref<string>('')
// ESLINT-FIX-2025-K: Use proper recipe interface for similar recipes with typed id
interface SimilarRecipe {
  id: string
  name: string
  description: string
  total_time?: string
  calories?: number
  [key: string]: unknown
}
const similarRecipes = ref<SimilarRecipe[]>([])
const isLoading = ref(false)
const isModifying = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)
const showModifyDialog = ref(false)
const resendingEmail = ref(false)
const retryAttempt = ref(1)
const loadingMessage = ref('Creating your recipe...')
const loadingSubMessage = ref('Our AI chef is working on something delicious for you')

// Generate recipe from natural language
const generateRecipe = async () => {
  if (!query.value.trim()) return

  isLoading.value = true
  error.value = null
  similarRecipes.value = []
  currentDraft.value = null
  retryAttempt.value = 1
  loadingMessage.value = 'Creating your recipe...'
  loadingSubMessage.value = 'Our AI chef is working on something delicious for you'

  const maxRetries = 3
  // ESLINT-FIX-2025-I: Replace 'any' with proper error type and use variable
  let lastError: unknown = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    retryAttempt.value = attempt

    if (attempt > 1) {
      loadingMessage.value = `Trying again... (${attempt}/${maxRetries})`
      loadingSubMessage.value =
        attempt === 2
          ? 'Sometimes the best recipes need a second try!'
          : "Third time's the charm - perfecting your recipe..."
    }

    try {
      const response = await LLMService.generateRecipe(query.value)

      // Check if we got similar recipes instead of a new generation
      if (response.similar_recipes && response.similar_recipes.length > 0) {
        // ESLINT-FIX-2025-K: Type assertion for similar recipes from API
        similarRecipes.value = response.similar_recipes as SimilarRecipe[]
        currentDraft.value = null
        currentDraftId.value = ''
      } else if (response.recipe) {
        currentDraft.value = response.recipe
        currentDraftId.value = response.draft_id || ''
        similarRecipes.value = []
      }

      // Success - break out of retry loop
      break
    } catch (err: unknown) {
      // ESLINT-FIX-2025-I: Replace 'any' with proper error type
      lastError = err
      console.error(`Recipe generation attempt ${attempt} failed:`, err)

      // Handle email verification required error (don't retry)
      // ESLINT-FIX-2025-K: Proper type checking for error response
      if (err && typeof err === 'object' && 'response' in err) {
        const errResponse = (
          err as { response?: { status?: number; data?: { error?: string; message?: string } } }
        ).response
        if (errResponse?.status === 403) {
          const errorData = errResponse?.data
          if (errorData?.error === 'email verification required') {
            error.value =
              errorData.message || 'Please verify your email address to generate recipes.'
            notificationStore.info('Email verification required to generate recipes')
            break
          } else {
            error.value = 'Access denied. Please check your account status.'
            break
          }
        } else if (errResponse?.status === 401) {
          error.value = 'Your session has expired. Please log in again.'
          break
        } else if (errResponse?.status === 429) {
          error.value = 'Rate limit exceeded. Please wait before trying again.'
          break
        }
      }

      // If this is the last attempt, set the error
      if (attempt === maxRetries) {
        if (err && typeof err === 'object' && 'response' in err) {
          const errResponse = (err as { response?: { status?: number } }).response
          if (errResponse?.status && errResponse.status >= 500) {
            error.value = `Recipe generation failed after ${maxRetries} attempts. Our AI chef seems to be having trouble - please try again later.`
          } else {
            error.value = `Failed to generate recipe after ${maxRetries} attempts. Please try again.`
          }
        } else {
          error.value = `Failed to generate recipe after ${maxRetries} attempts. Please try again.`
        }
      }

      // Wait a bit before retrying (except on last attempt)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  // ESLINT-FIX-2025-I: Use lastError to handle final failure after all retries
  if (lastError) {
    console.error('All recipe generation attempts failed:', lastError)
    error.value = 'Failed to generate recipe after multiple attempts. Please try again.'
  }

  isLoading.value = false
}

// Generate new variation even when similar recipes exist
const generateNewVariation = async () => {
  if (!query.value.trim()) return

  isLoading.value = true
  error.value = null
  similarRecipes.value = []
  retryAttempt.value = 1
  loadingMessage.value = 'Creating your recipe variation...'
  loadingSubMessage.value = 'Our AI chef is creating a unique variation for you'

  const maxRetries = 3

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    retryAttempt.value = attempt

    if (attempt > 1) {
      loadingMessage.value = `Trying again... (${attempt}/${maxRetries})`
      loadingSubMessage.value =
        attempt === 2
          ? 'Sometimes the best recipes need a second try!'
          : "Third time's the charm - perfecting your recipe..."
    }

    try {
      const response = await LLMService.generateRecipe(query.value, true) // Skip similar check
      if (response.recipe) {
        currentDraft.value = response.recipe
        currentDraftId.value = response.draft_id || ''
      }
      break // Success
    } catch (err: unknown) {
      // ESLINT-FIX-2025-I: Replace 'any' with proper error type
      console.error(`Recipe variation attempt ${attempt} failed:`, err)

      // Handle non-retryable errors
      // ESLINT-FIX-2025-K: Proper type checking for error response
      if (err && typeof err === 'object' && 'response' in err) {
        const errResponse = (
          err as { response?: { status?: number; data?: { error?: string; message?: string } } }
        ).response
        if (errResponse?.status === 403) {
          const errorData = errResponse?.data
          if (errorData?.error === 'email verification required') {
            error.value =
              errorData.message || 'Please verify your email address to generate recipes.'
            notificationStore.info('Email verification required to generate recipes')
            break
          } else {
            error.value = 'Access denied. Please check your account status.'
            break
          }
        } else if (errResponse?.status === 401) {
          error.value = 'Your session has expired. Please log in again.'
          break
        } else if (errResponse?.status === 429) {
          error.value = 'Rate limit exceeded. Please wait before trying again.'
          break
        }
      }

      // If this is the last attempt, set the error
      if (attempt === maxRetries) {
        if (err && typeof err === 'object' && 'response' in err) {
          const errResponse = (err as { response?: { status?: number } }).response
          if (errResponse?.status && errResponse.status >= 500) {
            error.value = `Recipe generation failed after ${maxRetries} attempts. Our AI chef seems to be having trouble - please try again later.`
          } else {
            error.value = `Failed to generate recipe after ${maxRetries} attempts. Please try again.`
          }
        } else {
          error.value = `Failed to generate recipe after ${maxRetries} attempts. Please try again.`
        }
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  isLoading.value = false
}

// Modify existing recipe
const modifyRecipe = async () => {
  if (!modifyQuery.value.trim() || !currentDraftId.value) return

  isModifying.value = true
  error.value = null

  try {
    const response = await LLMService.modifyRecipe(modifyQuery.value, currentDraftId.value)
    console.log('🔍 DEBUG: Modification response:', response)
    console.log('🔍 DEBUG: Response recipe nutrition:', response.recipe?.calories, response.recipe?.calories_per_serving)
    currentDraft.value = response.recipe || null
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
  } catch (err: unknown) {
    // Stay on the page and show error - don't lose the generated recipe
    if (err && typeof err === 'object' && 'response' in err) {
      const response = (err as { response?: { status?: number } }).response
      if (response?.status === 401) {
        error.value = 'Your session has expired. Please log in again.'
      } else if (response?.status && response.status >= 500) {
        error.value = 'Server error occurred while saving. Please try again.'
      }
    } else if (err && typeof err === 'object' && 'message' in err) {
      error.value =
        (err as { message: string }).message || 'Failed to save recipe. Please try again.'
    } else {
      error.value = 'Failed to save recipe. Please try again.'
    }
    console.error('Recipe saving error:', err)
    isSaving.value = false
  }
}

// Start over with new generation
const startOver = () => {
  currentDraft.value = null
  currentDraftId.value = ''
  similarRecipes.value = []
  query.value = ''
  modifyQuery.value = ''
  error.value = null
  showModifyDialog.value = false
}

// Resend verification email
const resendVerificationEmail = async () => {
  if (!authStore.user?.email) return

  resendingEmail.value = true
  try {
    const response = await AuthService.resendVerificationEmail(authStore.user.email)
    notificationStore.success(response.message || 'Verification email sent')
    error.value = null // Clear the error after successfully sending email
  } catch (error: unknown) {
    // ESLINT-FIX-2025-I: Replace 'any' with proper error type for email resend
    const message =
      error instanceof Error &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'data' in error.response &&
      typeof error.response.data === 'object' &&
      error.response.data !== null &&
      'error' in error.response.data &&
      typeof error.response.data.error === 'string'
        ? error.response.data.error
        : 'Failed to send verification email'
    notificationStore.error(message)
  } finally {
    resendingEmail.value = false
  }
}

// Load draft from URL if present
const loadDraftFromUrl = async () => {
  const draftId = route.query.draft as string
  if (!draftId) return

  isLoading.value = true
  loadingMessage.value = 'Loading your recipe...'
  loadingSubMessage.value = 'Retrieving your customized recipe'

  try {
    // Get the draft using the draft_id
    const response = await api.get(`/llm/drafts/${draftId}`)
    if (response.data.draft) {
      currentDraft.value = response.data.draft
      currentDraftId.value = draftId

      // Show notification about the loaded draft
      notificationStore.info('Recipe loaded! You can make additional modifications or save it.')
    }
  } catch (err: unknown) {
    // ESLINT-FIX-2025-I: Replace 'any' with proper error type
    console.error('Failed to load draft:', err)
    error.value = 'Failed to load recipe draft. It may have expired or been saved already.'
  } finally {
    isLoading.value = false
  }
}

// Load draft on component mount
onMounted(() => {
  loadDraftFromUrl()
})
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
