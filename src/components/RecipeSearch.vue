<template>
  <div>
    <!-- Vuetify Search Form -->
    <template v-if="uiStore.useVuetify">
      <v-card class="mx-auto" max-width="800">
        <v-card-text>
          <v-form @submit.prevent="handleSearch" class="mt-4">
            <v-row>
              <!-- Search Input -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchForm.query"
                  label="Search recipes"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  hide-details
                ></v-text-field>
              </v-col>

              <!-- Cuisine Type -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="searchForm.cuisine"
                  :items="cuisineTypes"
                  label="Cuisine Type"
                  clearable
                  hide-details
                ></v-select>
              </v-col>

              <!-- Cooking Time Range -->
              <v-col cols="12" md="6">
                <v-range-slider
                  v-model="searchForm.cookingTime"
                  :min="0"
                  :max="180"
                  :step="5"
                  label="Cooking Time (minutes)"
                  thumb-label
                  hide-details
                ></v-range-slider>
              </v-col>

              <!-- Difficulty Level -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="searchForm.difficulty"
                  :items="difficultyLevels"
                  label="Difficulty Level"
                  clearable
                  hide-details
                ></v-select>
              </v-col>

              <!-- Dietary Restrictions -->
              <v-col cols="12">
                <v-chip-group
                  v-model="searchForm.dietaryRestrictions"
                  multiple
                  column
                >
                  <v-chip
                    v-for="diet in dietaryOptions"
                    :key="diet.value"
                    :value="diet.value"
                    filter
                    variant="outlined"
                  >
                    {{ diet.label }}
                  </v-chip>
                </v-chip-group>
              </v-col>

              <!-- Sort Options -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="searchForm.sortBy"
                  :items="sortOptions"
                  label="Sort By"
                  hide-details
                ></v-select>
              </v-col>

              <!-- Search Button -->
              <v-col cols="12" md="6" class="d-flex justify-end">
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="isSearching"
                  class="ml-auto"
                >
                  Search
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </template>

    <!-- Tailwind Search Form -->
    <template v-else>
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <form @submit.prevent="handleSearch" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Search Input -->
              <div>
                <label for="search-query" class="block text-sm font-medium text-gray-700">Search recipes</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="search-query"
                    v-model="searchForm.query"
                    type="text"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search recipes..."
                  />
                </div>
              </div>

              <!-- Cuisine Type -->
              <div>
                <label for="cuisine-type" class="block text-sm font-medium text-gray-700">Cuisine Type</label>
                <select
                  id="cuisine-type"
                  v-model="searchForm.cuisine"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select cuisine</option>
                  <option v-for="cuisine in cuisineTypes" :key="cuisine" :value="cuisine">
                    {{ cuisine }}
                  </option>
                </select>
              </div>

              <!-- Cooking Time Range -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Cooking Time (minutes)</label>
                <div class="mt-2 px-2">
                  <input
                    type="range"
                    v-model="searchForm.cookingTime[0]"
                    :min="0"
                    :max="180"
                    :step="5"
                    class="w-full"
                  />
                  <input
                    type="range"
                    v-model="searchForm.cookingTime[1]"
                    :min="0"
                    :max="180"
                    :step="5"
                    class="w-full"
                  />
                  <div class="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{{ searchForm.cookingTime[0] }} min</span>
                    <span>{{ searchForm.cookingTime[1] }} min</span>
                  </div>
                </div>
              </div>

              <!-- Difficulty Level -->
              <div>
                <label for="difficulty" class="block text-sm font-medium text-gray-700">Difficulty Level</label>
                <select
                  id="difficulty"
                  v-model="searchForm.difficulty"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select difficulty</option>
                  <option v-for="level in difficultyLevels" :key="level" :value="level">
                    {{ level }}
                  </option>
                </select>
              </div>

              <!-- Sort Options -->
              <div>
                <label for="sort-by" class="block text-sm font-medium text-gray-700">Sort By</label>
                <select
                  id="sort-by"
                  v-model="searchForm.sortBy"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Dietary Restrictions -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="diet in dietaryOptions"
                    :key="diet.value"
                    type="button"
                    @click="toggleDietaryRestriction(diet.value)"
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      searchForm.dietaryRestrictions.includes(diet.value)
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    ]"
                  >
                    {{ diet.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Search Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isSearching"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <svg v-if="isSearching" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const isSearching = ref(false)

const cuisineTypes = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'American',
  'French',
  'Korean'
]

const difficultyLevels = [
  'Easy',
  'Medium',
  'Hard',
  'Expert'
]

const dietaryOptions = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Dairy-Free', value: 'dairy-free' },
  { label: 'Nut-Free', value: 'nut-free' },
  { label: 'Halal', value: 'halal' },
  { label: 'Kosher', value: 'kosher' }
]

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Cooking Time (Low to High)', value: 'time-asc' },
  { label: 'Cooking Time (High to Low)', value: 'time-desc' },
  { label: 'Difficulty (Easy to Hard)', value: 'difficulty-asc' },
  { label: 'Difficulty (Hard to Easy)', value: 'difficulty-desc' }
]

const searchForm = reactive({
  query: '',
  cuisine: '',
  cookingTime: [0, 180],
  difficulty: '',
  dietaryRestrictions: [] as string[],
  sortBy: 'popular'
})

const toggleDietaryRestriction = (value: string) => {
  const index = searchForm.dietaryRestrictions.indexOf(value)
  if (index === -1) {
    searchForm.dietaryRestrictions.push(value)
  } else {
    searchForm.dietaryRestrictions.splice(index, 1)
  }
}

const handleSearch = async () => {
  isSearching.value = true
  try {
    // TODO: Implement search logic
    console.log('Search form submitted:', searchForm)
  } catch (error) {
    console.error('Error during search:', error)
  } finally {
    isSearching.value = false
  }
}
</script> 