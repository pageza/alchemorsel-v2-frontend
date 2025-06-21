<!--
TODO: MANUAL RECIPE CREATION FORM - KEPT AS FALLBACK

This component provides a manual form-based approach for creating recipes and is intentionally 
maintained alongside the AI-powered recipe generation system (/generate route) for the following reasons:

1. **Fallback Option**: If the AI service is unavailable or experiencing issues, users can still 
   create recipes manually through this traditional form interface.

2. **User Preference**: Some users prefer manual control over every aspect of recipe creation 
   rather than AI generation, especially professional chefs or users with very specific requirements.

3. **Edge Cases**: For highly specialized, traditional, or culturally specific recipes that the AI 
   might not handle well, manual creation ensures accuracy and authenticity.

4. **Recipe Editing**: When editing existing recipes (/recipes/:id/edit), users expect a form-based 
   interface where they can modify specific fields directly rather than using natural language.

5. **Migration Path**: Provides a smooth transition for existing users who are familiar with 
   form-based recipe creation and may be hesitant to adopt AI-generated recipes immediately.

The primary workflow is now: User clicks "Create Recipe" → Goes to /generate (AI-powered) 
But this form remains accessible via direct URL (/recipes/create) for the scenarios above.
-->

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="text-h6 mt-4">Loading template...</p>
    </div>

    <v-container v-else class="py-8">
      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <div class="d-flex align-center mb-4">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              class="mr-4"
              @click="$router.back()"
            ></v-btn>
            <h1 class="text-h4 font-weight-bold">
              {{ isEdit ? 'Edit Recipe' : isTemplate ? 'Modify Recipe' : 'Create Recipe' }}
            </h1>
            <p v-if="isTemplate" class="text-subtitle-1 text-medium-emphasis mt-2">
              Creating a new recipe based on template
            </p>
          </div>

          <v-form
            ref="form"
            v-model="isFormValid"
            @submit.prevent="handleSubmit"
          >
            <!-- Basic Information -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Basic Information
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="recipe.name"
                      label="Recipe Name"
                      :rules="[v => !!v || 'Name is required']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="recipe.description"
                      label="Description"
                      :rules="[v => !!v || 'Description is required']"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="recipe.category"
                      :items="categories"
                      label="Category"
                      :rules="[v => !!v || 'Category is required']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="recipe.cook_time"
                      label="Cook Time (minutes)"
                      type="number"
                      :rules="[
                        v => !!v || 'Cook time is required',
                        v => v > 0 || 'Cook time must be greater than 0'
                      ]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Ingredients -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Ingredients
              </v-card-title>
              <v-card-text>
                <div
                  v-for="(ingredient, index) in recipe.ingredients"
                  :key="index"
                  class="d-flex align-center mb-4"
                >
                  <v-text-field
                    v-model="recipe.ingredients[index]"
                    :label="`Ingredient ${index + 1}`"
                    placeholder="e.g., 2 cups all-purpose flour"
                    class="mr-4"
                    :rules="[v => !!v || 'Ingredient is required']"
                  ></v-text-field>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="removeIngredient(index)"
                    :disabled="recipe.ingredients.length === 1"
                  ></v-btn>
                </div>
                <v-btn
                  prepend-icon="mdi-plus"
                  variant="outlined"
                  @click="addIngredient"
                >
                  Add Ingredient
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- Instructions -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Instructions
              </v-card-title>
              <v-card-text>
                <div
                  v-for="(instruction, index) in recipe.instructions"
                  :key="index"
                  class="d-flex align-center mb-4"
                >
                  <v-textarea
                    v-model="recipe.instructions[index]"
                    :label="`Step ${index + 1}`"
                    class="mr-4"
                    :rules="[v => !!v || 'Step is required']"
                  ></v-textarea>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="removeInstruction(index)"
                    :disabled="recipe.instructions.length === 1"
                  ></v-btn>
                </div>
                <v-btn
                  prepend-icon="mdi-plus"
                  variant="outlined"
                  @click="addInstruction"
                >
                  Add Step
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- Nutrition Information -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Nutrition Information
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="recipe.calories"
                      label="Calories"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="recipe.protein"
                      label="Protein (g)"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="recipe.carbs"
                      label="Carbohydrates (g)"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="recipe.fat"
                      label="Fat (g)"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>


            <!-- Submit Button -->
            <div class="d-flex justify-end">
              <v-btn
                type="submit"
                color="primary"
                size="large"
                :loading="isSubmitting"
                :disabled="!isFormValid"
              >
                {{ isEdit ? 'Update Recipe' : isTemplate ? 'Create Modified Recipe' : 'Create Recipe' }}
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RecipeService } from '@/services/recipe.service'
import type { Recipe } from '@/types/recipe.types'

const route = useRoute()
const router = useRouter()
const form = ref<HTMLFormElement | null>(null)
const isFormValid = ref(false)
const isSubmitting = ref(false)

const isEdit = computed(() => route.name === 'recipe-edit')
const isTemplate = computed(() => !!route.query.template)
const templateId = computed(() => route.query.template as string)

// Mock categories - replace with actual categories from your backend
const categories = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snacks',
  'Beverages'
]

// Initialize recipe data
const recipe = ref<{
  name: string
  description: string
  category: string
  cuisine: string
  image_url: string
  ingredients: string[]
  instructions: string[]
  prep_time: number
  cook_time: number
  servings: number
  difficulty: string
  calories: number
  protein: number
  carbs: number
  fat: number
  dietary_preferences: string[]
  tags: string[]
}>({
  name: '',
  description: '',
  category: '',
  cuisine: '',
  image_url: '',
  ingredients: [''],
  instructions: [''],
  prep_time: 15,
  cook_time: 30,
  servings: 4,
  difficulty: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  dietary_preferences: [],
  tags: []
})

const isLoading = ref(false)

// Methods for managing ingredients and instructions
const addIngredient = () => {
  recipe.value.ingredients.push('')
}

const removeIngredient = (index: number) => {
  if (recipe.value.ingredients.length > 1) {
    recipe.value.ingredients.splice(index, 1)
  }
}

const addInstruction = () => {
  recipe.value.instructions.push('')
}

const removeInstruction = (index: number) => {
  if (recipe.value.instructions.length > 1) {
    recipe.value.instructions.splice(index, 1)
  }
}


// Handle form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  try {
    if (isEdit.value) {
      // Update existing recipe (not implemented yet)
      console.log('Updating recipe:', recipe.value)
    } else {
      // Create new recipe (either from scratch or from template)
      const createdRecipe = await RecipeService.createRecipe(recipe.value)
      console.log('Created recipe:', createdRecipe)
      
      // Navigate to the new recipe details
      router.push(`/recipes/${createdRecipe.id}`)
    }
  } catch (error) {
    console.error('Error saving recipe:', error)
    // TODO: Show error message to user
  } finally {
    isSubmitting.value = false
  }
}

// Load template data if template ID is provided
const loadTemplate = async () => {
  if (!templateId.value) return
  
  isLoading.value = true
  try {
    const templateRecipe = await RecipeService.getRecipeById(templateId.value)
    
    // Copy template data but reset ID and dates (creating new recipe)
    recipe.value = {
      name: `${templateRecipe.name} (Modified)`,
      description: templateRecipe.description,
      category: templateRecipe.category,
      cuisine: templateRecipe.cuisine,
      image_url: templateRecipe.image_url || '',
      ingredients: [...templateRecipe.ingredients],
      instructions: [...templateRecipe.instructions],
      prep_time: templateRecipe.prep_time || 15,
      cook_time: templateRecipe.cook_time || 30,
      servings: templateRecipe.servings || 4,
      difficulty: templateRecipe.difficulty || '',
      calories: templateRecipe.calories,
      protein: templateRecipe.protein,
      carbs: templateRecipe.carbs,
      fat: templateRecipe.fat,
      dietary_preferences: [...templateRecipe.dietary_preferences],
      tags: [...templateRecipe.tags]
    }
  } catch (error) {
    console.error('Error loading template:', error)
    // TODO: Show error message to user
  } finally {
    isLoading.value = false
  }
}

// Load data on component mount
onMounted(() => {
  if (isTemplate.value) {
    loadTemplate()
  }
  // TODO: Load existing recipe data if in edit mode
})
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style> 