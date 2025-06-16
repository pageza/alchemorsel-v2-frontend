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
    <v-container class="py-8">
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
              {{ isEdit ? 'Edit Recipe' : 'Create Recipe' }}
            </h1>
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
                      v-model="recipe.title"
                      label="Recipe Title"
                      :rules="[v => !!v || 'Title is required']"
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
                      v-model.number="recipe.cookingTime"
                      label="Cooking Time (minutes)"
                      type="number"
                      :rules="[
                        v => !!v || 'Cooking time is required',
                        v => v > 0 || 'Cooking time must be greater than 0'
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
                    v-model="ingredient.name"
                    label="Ingredient Name"
                    class="mr-4"
                    :rules="[v => !!v || 'Name is required']"
                  ></v-text-field>
                  <v-text-field
                    v-model="ingredient.amount"
                    label="Amount"
                    class="mr-4"
                    :rules="[v => !!v || 'Amount is required']"
                  ></v-text-field>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="removeIngredient(index)"
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
                      v-model="recipe.nutrition.calories"
                      label="Calories"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="recipe.nutrition.protein"
                      label="Protein (g)"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="recipe.nutrition.carbohydrates"
                      label="Carbohydrates (g)"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="recipe.nutrition.fat"
                      label="Fat (g)"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Image Upload -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Recipe Image
              </v-card-title>
              <v-card-text>
                <v-file-input
                  v-model="imageFile"
                  accept="image/*"
                  label="Upload Image"
                  prepend-icon="mdi-camera"
                  @change="handleImageUpload"
                ></v-file-input>
                <v-img
                  v-if="recipe.image"
                  :src="recipe.image"
                  height="200"
                  cover
                  class="rounded-lg mt-4"
                ></v-img>
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
                {{ isEdit ? 'Update Recipe' : 'Create Recipe' }}
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const form = ref(null)
const isFormValid = ref(false)
const isSubmitting = ref(false)
const imageFile = ref(null)

const isEdit = computed(() => route.name === 'recipe-edit')

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
const recipe = ref({
  title: '',
  description: '',
  category: '',
  cookingTime: 30,
  image: '',
  ingredients: [{ name: '', amount: '' }],
  instructions: [''],
  nutrition: {
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: ''
  }
})

// Methods for managing ingredients and instructions
const addIngredient = () => {
  recipe.value.ingredients.push({ name: '', amount: '' })
}

const removeIngredient = (index) => {
  recipe.value.ingredients.splice(index, 1)
}

const addInstruction = () => {
  recipe.value.instructions.push('')
}

const removeInstruction = (index) => {
  recipe.value.instructions.splice(index, 1)
}

// Handle image upload
const handleImageUpload = (file) => {
  if (file) {
    // TODO: Implement actual image upload to your backend
    // For now, we'll just create a local URL
    recipe.value.image = URL.createObjectURL(file)
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!form.value.validate()) return

  isSubmitting.value = true
  try {
    // TODO: Implement actual API call to your backend
    if (isEdit.value) {
      // Update existing recipe
      console.log('Updating recipe:', recipe.value)
    } else {
      // Create new recipe
      console.log('Creating recipe:', recipe.value)
    }
    
    // Navigate back to recipe list on success
    router.push('/recipes')
  } catch (error) {
    console.error('Error saving recipe:', error)
    // TODO: Show error message to user
  } finally {
    isSubmitting.value = false
  }
}

// Load recipe data if in edit mode
if (isEdit.value) {
  // TODO: Fetch existing recipe data from your backend
  // For now, we'll use mock data
  recipe.value = {
    title: 'Classic Margherita Pizza',
    description: 'A simple yet delicious pizza with fresh tomatoes, mozzarella, and basil.',
    category: 'Dinner',
    cookingTime: 30,
    image: 'https://picsum.photos/800/600?random=1',
    ingredients: [
      { name: 'Pizza dough', amount: '1 ball' },
      { name: 'Fresh mozzarella', amount: '200g' },
      { name: 'Fresh basil leaves', amount: '1 cup' }
    ],
    instructions: [
      'Preheat your oven to 450°F (230°C)',
      'Roll out the pizza dough',
      'Add toppings and bake for 12-15 minutes'
    ],
    nutrition: {
      calories: '266',
      protein: '11',
      carbohydrates: '33',
      fat: '10'
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style> 