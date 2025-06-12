<template>
  <!-- Vuetify Implementation -->
  <div v-if="uiStore.useVuetify">
    <v-card class="pa-4">
      <v-card-title class="text-h5 mb-4">
        Edit Recipe
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          @click="saveAsDraft"
          :loading="isSavingDraft"
        >
          Save as Draft
        </v-btn>
      </v-card-title>

      <v-form ref="form" v-model="isFormValid" @submit.prevent="handleSubmit">
        <!-- Basic Info -->
        <v-text-field
          v-model="recipe.name"
          label="Recipe Name"
          :rules="[v => !!v || 'Name is required']"
          required
        ></v-text-field>

        <v-textarea
          v-model="recipe.description"
          label="Description"
          :rules="[v => !!v || 'Description is required']"
          required
        ></v-textarea>

        <v-select
          v-model="recipe.cuisine"
          :items="cuisineTypes"
          label="Cuisine Type"
          :rules="[v => !!v || 'Cuisine is required']"
          required
        ></v-select>

        <v-text-field
          v-model.number="recipe.cookingTime"
          label="Cooking Time (minutes)"
          type="number"
          :rules="[
            v => !!v || 'Cooking time is required',
            v => v > 0 || 'Cooking time must be positive'
          ]"
          required
        ></v-text-field>

        <!-- Image Upload -->
        <v-card class="mb-4">
          <v-img
            :src="recipe.imageUrl || '/placeholder-recipe.jpg'"
            height="200"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-card-actions>
            <v-file-input
              v-model="newImage"
              accept="image/*"
              label="Change Image"
              prepend-icon="mdi-camera"
              @change="handleImageChange"
            ></v-file-input>
          </v-card-actions>
        </v-card>

        <!-- Ingredients -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            Ingredients
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="text"
              prepend-icon="mdi-plus"
              @click="addIngredient"
            >
              Add Ingredient
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row v-for="(ingredient, index) in recipe.ingredients" :key="index">
              <v-col cols="11">
                <v-text-field
                  v-model="ingredient.text"
                  :label="`Ingredient ${index + 1}`"
                  :rules="[v => !!v || 'Ingredient is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="d-flex align-center">
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  @click="removeIngredient(index)"
                ></v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Instructions -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            Instructions
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="text"
              prepend-icon="mdi-plus"
              @click="addInstruction"
            >
              Add Step
            </v-btn>
          </v-card-title>
          <v-card-text>
            <draggable
              v-model="recipe.instructions"
              item-key="id"
              handle=".drag-handle"
              class="instruction-list"
            >
              <template #item="{ element, index }">
                <v-row class="mb-2">
                  <v-col cols="1" class="d-flex align-center">
                    <v-icon class="drag-handle cursor-move">mdi-drag</v-icon>
                  </v-col>
                  <v-col cols="10">
                    <v-textarea
                      v-model="element.text"
                      :label="`Step ${index + 1}`"
                      :rules="[v => !!v || 'Step is required']"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center">
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removeInstruction(index)"
                    ></v-btn>
                  </v-col>
                </v-row>
              </template>
            </draggable>
          </v-card-text>
        </v-card>

        <!-- Version History -->
        <v-expansion-panels v-if="recipe.versions?.length">
          <v-expansion-panel>
            <v-expansion-panel-title>Version History</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-timeline>
                <v-timeline-item
                  v-for="version in recipe.versions"
                  :key="version.id"
                  :dot-color="version.isPublished ? 'primary' : 'grey'"
                  size="small"
                >
                  <div class="d-flex justify-space-between">
                    <div>
                      <div class="text-subtitle-2">{{ version.name }}</div>
                      <div class="text-caption">{{ formatDate(version.createdAt) }}</div>
                    </div>
                    <v-btn
                      v-if="!version.isPublished"
                      variant="text"
                      size="small"
                      @click="restoreVersion(version)"
                    >
                      Restore
                    </v-btn>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            type="submit"
            :loading="isSubmitting"
            :disabled="!isFormValid"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>

  <!-- Tailwind Implementation -->
  <div v-else class="max-w-4xl mx-auto p-4">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Edit Recipe</h2>
        <button
          @click="saveAsDraft"
          :disabled="isSavingDraft"
          class="px-4 py-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          <span v-if="isSavingDraft" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
          <span v-else>Save as Draft</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Recipe Name</label>
          <input
            v-model="recipe.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="recipe.description"
            required
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Cuisine Type</label>
          <select
            v-model="recipe.cuisine"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option v-for="cuisine in cuisineTypes" :key="cuisine" :value="cuisine">
              {{ cuisine }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Cooking Time (minutes)</label>
          <input
            v-model.number="recipe.cookingTime"
            type="number"
            required
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>

        <!-- Image Upload -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Recipe Image</label>
          <div class="relative">
            <img
              :src="recipe.imageUrl || '/placeholder-recipe.jpg'"
              class="w-full h-48 object-cover rounded-lg"
              alt="Recipe preview"
            >
            <div class="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <label class="cursor-pointer bg-white px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageChange"
                >
              </label>
            </div>
          </div>
        </div>

        <!-- Ingredients -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Ingredients</h3>
            <button
              type="button"
              @click="addIngredient"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Ingredient
            </button>
          </div>
          <div class="space-y-2">
            <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex gap-2">
              <input
                v-model="ingredient.text"
                type="text"
                required
                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                :placeholder="`Ingredient ${index + 1}`"
              >
              <button
                type="button"
                @click="removeIngredient(index)"
                class="p-2 text-red-600 hover:text-red-800"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Instructions</h3>
            <button
              type="button"
              @click="addInstruction"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Step
            </button>
          </div>
          <draggable
            v-model="recipe.instructions"
            item-key="id"
            handle=".drag-handle"
            class="space-y-2"
          >
            <template #item="{ element, index }">
              <div class="flex gap-2 items-start">
                <button
                  type="button"
                  class="drag-handle p-2 text-gray-400 hover:text-gray-600 cursor-move"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                  </svg>
                </button>
                <div class="flex-1">
                  <textarea
                    v-model="element.text"
                    required
                    rows="2"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    :placeholder="`Step ${index + 1}`"
                  ></textarea>
                </div>
                <button
                  type="button"
                  @click="removeInstruction(index)"
                  class="p-2 text-red-600 hover:text-red-800"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </template>
          </draggable>
        </div>

        <!-- Version History -->
        <div v-if="recipe.versions?.length" class="border-t pt-4">
          <button
            type="button"
            @click="showVersionHistory = !showVersionHistory"
            class="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <span>Version History</span>
            <svg
              class="ml-1 h-5 w-5 transform transition-transform"
              :class="{ 'rotate-180': showVersionHistory }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div v-if="showVersionHistory" class="mt-4 space-y-4">
            <div
              v-for="version in recipe.versions"
              :key="version.id"
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div class="font-medium">{{ version.name }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(version.createdAt) }}</div>
              </div>
              <button
                v-if="!version.isPublished"
                @click="restoreVersion(version)"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Restore
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import draggable from 'vuedraggable'

const uiStore = useUIStore()

interface Ingredient {
  text: string
}

interface Instruction {
  id: string
  text: string
}

interface Version {
  id: string
  name: string
  createdAt: string
  isPublished: boolean
}

interface Recipe {
  name: string
  description: string
  cuisine: string
  cookingTime: number
  imageUrl: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  versions?: Version[]
}

// Form state
const form = ref(null)
const isFormValid = ref(true)
const isSubmitting = ref(false)
const isSavingDraft = ref(false)
const showVersionHistory = ref(false)
const newImage = ref(null)

// Recipe data
const recipe = reactive<Recipe>({
  name: '',
  description: '',
  cuisine: '',
  cookingTime: 30,
  imageUrl: '',
  ingredients: [],
  instructions: [],
  versions: []
})

// Cuisine types
const cuisineTypes = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'American',
  'Mediterranean',
  'French',
  'Korean'
]

// Methods
const addIngredient = () => {
  recipe.ingredients.push({ text: '' })
}

const removeIngredient = (index: number) => {
  recipe.ingredients.splice(index, 1)
}

const addInstruction = () => {
  recipe.instructions.push({
    id: Date.now().toString(),
    text: ''
  })
}

const removeInstruction = (index: number) => {
  recipe.instructions.splice(index, 1)
}

const handleImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // TODO: Implement image upload logic
    const reader = new FileReader()
    reader.onload = (e) => {
      recipe.imageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveAsDraft = async () => {
  isSavingDraft.value = true
  try {
    // TODO: Implement draft saving logic
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    isSavingDraft.value = false
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  try {
    // TODO: Implement form submission logic
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    isSubmitting.value = false
  }
}

const restoreVersion = (version: Version) => {
  // TODO: Implement version restoration logic
  console.log('Restoring version:', version)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load initial recipe data
const loadRecipe = async () => {
  // TODO: Implement recipe loading logic
  // This would typically fetch the recipe data from your API
  recipe.name = 'Classic Margherita Pizza'
  recipe.description = 'A traditional Italian pizza with fresh mozzarella, tomatoes, and basil.'
  recipe.cuisine = 'Italian'
  recipe.cookingTime = 45
  recipe.imageUrl = '/pizza.jpg'
  recipe.ingredients = [
    { text: '2 cups all-purpose flour' },
    { text: '1 cup warm water' },
    { text: '2 1/4 tsp active dry yeast' },
    { text: '1 tsp salt' },
    { text: '1 tbsp olive oil' }
  ]
  recipe.instructions = [
    { id: '1', text: 'Mix flour, yeast, and salt in a large bowl.' },
    { id: '2', text: 'Add warm water and olive oil, knead until smooth.' },
    { id: '3', text: 'Let dough rise for 1 hour.' }
  ]
  recipe.versions = [
    {
      id: '1',
      name: 'Initial Version',
      createdAt: '2024-01-01T12:00:00Z',
      isPublished: true
    },
    {
      id: '2',
      name: 'Updated Ingredients',
      createdAt: '2024-01-15T15:30:00Z',
      isPublished: false
    }
  ]
}

// Load recipe data when component mounts
loadRecipe()
</script>

<style scoped>
.instruction-list {
  min-height: 100px;
}

.cursor-move {
  cursor: move;
}
</style> 