<template>
  <div>
    <!-- Vuetify Form -->
    <template v-if="uiStore.useVuetify">
      <v-form @submit.prevent="handleSubmit" class="pa-4">
        <v-text-field
          v-model="form.name"
          label="Recipe Name"
          :rules="[v => !!v || 'Name is required']"
          required
        ></v-text-field>

        <v-textarea
          v-model="form.description"
          label="Description"
          :rules="[v => !!v || 'Description is required']"
          required
        ></v-textarea>

        <v-select
          v-model="form.cuisine"
          :items="cuisines"
          label="Cuisine"
          :rules="[v => !!v || 'Cuisine is required']"
          required
        ></v-select>

        <v-text-field
          v-model="form.cookingTime"
          label="Cooking Time (minutes)"
          type="number"
          :rules="[
            v => !!v || 'Cooking time is required',
            v => v > 0 || 'Cooking time must be positive'
          ]"
          required
        ></v-text-field>

        <v-textarea
          v-model="form.instructions"
          label="Instructions"
          :rules="[v => !!v || 'Instructions are required']"
          required
        ></v-textarea>

        <v-textarea
          v-model="form.ingredients"
          label="Ingredients (one per line)"
          :rules="[v => !!v || 'Ingredients are required']"
          required
        ></v-textarea>

        <v-file-input
          v-model="form.image"
          label="Recipe Image"
          accept="image/*"
          prepend-icon="mdi-camera"
        ></v-file-input>

        <div class="d-flex justify-end mt-4">
          <v-btn
            type="submit"
            color="primary"
            :loading="isSubmitting"
          >
            Create Recipe
          </v-btn>
        </div>
      </v-form>
    </template>

    <!-- Tailwind Form -->
    <template v-else>
      <form @submit.prevent="handleSubmit" class="space-y-6 p-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Recipe Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div>
          <label for="cuisine" class="block text-sm font-medium text-gray-700">Cuisine</label>
          <select
            id="cuisine"
            v-model="form.cuisine"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a cuisine</option>
            <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">
              {{ cuisine }}
            </option>
          </select>
        </div>

        <div>
          <label for="cookingTime" class="block text-sm font-medium text-gray-700">Cooking Time (minutes)</label>
          <input
            id="cookingTime"
            v-model="form.cookingTime"
            type="number"
            min="1"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="instructions" class="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            id="instructions"
            v-model="form.instructions"
            rows="5"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div>
          <label for="ingredients" class="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
          <textarea
            id="ingredients"
            v-model="form.ingredients"
            rows="5"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Recipe Image</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="image" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    @change="handleImageChange"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Create Recipe
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const isSubmitting = ref(false)

const cuisines = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'French',
  'Mediterranean',
  'American',
  'Other'
]

const form = reactive({
  name: '',
  description: '',
  cuisine: '',
  cookingTime: '',
  instructions: '',
  ingredients: '',
  image: null as File | null
})

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.image = target.files[0]
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement form submission
    console.log('Form submitted:', form)
    // Reset form after successful submission
    Object.keys(form).forEach(key => {
      if (key === 'image') {
        form[key] = null
      } else {
        form[key] = ''
      }
    })
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script> 