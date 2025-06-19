<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Recipe Moderation</h1>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Filter by status"
          clearable
          @change="loadRecipes"
        />
      </v-col>
    </v-row>

    <!-- Recipes Table -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="recipes"
            :loading="loading"
            :server-items-length="totalRecipes"
            :options.sync="options"
            @update:options="loadRecipes"
            class="elevation-1"
          >
            <template #[`item.name`]="{ item }">
              <router-link
                :to="`/recipe/${item.id}`"
                target="_blank"
                class="text-decoration-none"
              >
                {{ item.name }}
              </router-link>
            </template>
            <template #[`item.user.name`]="{ item }">
              {{ item.user?.name || 'Unknown' }}
            </template>
            <template #[`item.is_hidden`]="{ item }">
              <v-chip
                small
                :color="item.is_hidden ? 'error' : 'success'"
              >
                {{ item.is_hidden ? 'Hidden' : 'Visible' }}
              </v-chip>
            </template>
            <template #[`item.created_at`]="{ item }">
              {{ formatDate(item.created_at) }}
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn
                v-if="!item.is_hidden"
                icon
                small
                color="warning"
                @click="openHideDialog(item)"
              >
                <v-icon>mdi-eye-off</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                small
                color="success"
                @click="unhideRecipe(item)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="error"
                @click="openDeleteDialog(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <template #[`expanded.item`]="{ headers, item }">
              <td :colspan="headers.length" class="pa-4">
                <v-row>
                  <v-col cols="12" md="6">
                    <h4 class="text-h6 mb-2">Description</h4>
                    <p>{{ item.description }}</p>
                    
                    <h4 class="text-h6 mb-2 mt-4">Ingredients</h4>
                    <ul>
                      <li v-for="(ingredient, idx) in item.ingredients" :key="idx">
                        {{ ingredient }}
                      </li>
                    </ul>
                  </v-col>
                  <v-col cols="12" md="6">
                    <h4 class="text-h6 mb-2">Instructions</h4>
                    <ol>
                      <li v-for="(instruction, idx) in item.instructions" :key="idx">
                        {{ instruction }}
                      </li>
                    </ol>
                    
                    <div v-if="item.moderation_reason" class="mt-4">
                      <h4 class="text-h6 mb-2">Moderation Reason</h4>
                      <v-alert type="warning" variant="text">
                        {{ item.moderation_reason }}
                      </v-alert>
                    </div>
                  </v-col>
                </v-row>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Hide Recipe Dialog -->
    <v-dialog v-model="hideDialog" max-width="400">
      <v-card>
        <v-card-title>Hide Recipe</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="hideReason"
            label="Reason for hiding (optional)"
            hint="Explain why this recipe is being hidden"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="hideDialog = false">Cancel</v-btn>
          <v-btn
            color="warning"
            :loading="loading"
            @click="hideRecipe"
          >
            Hide Recipe
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Recipe Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Recipe</v-card-title>
        <v-card-text>
          Are you sure you want to permanently delete this recipe? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            :loading="loading"
            @click="deleteRecipe"
          >
            Delete Recipe
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import { useNotificationStore } from '@/stores/notification.store'
import { format } from 'date-fns'
import type { Recipe } from '@/types'

const adminStore = useAdminStore()
const notificationStore = useNotificationStore()

// State
const selectedRecipe = ref<Recipe | null>(null)
const hideDialog = ref(false)
const deleteDialog = ref(false)
const hideReason = ref('')
const filterStatus = ref<string | null>(null)

// Data table options
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
  groupBy: [],
  groupDesc: [],
  multiSort: false,
  mustSort: false
})

const headers = [
  { text: 'Recipe Name', value: 'name' },
  { text: 'Author', value: 'user.name' },
  { text: 'Category', value: 'category' },
  { text: 'Status', value: 'is_hidden' },
  { text: 'Created', value: 'created_at' },
  { text: 'Actions', value: 'actions', sortable: false }
]

const statusOptions = [
  { text: 'All Recipes', value: null },
  { text: 'Visible Only', value: 'visible' },
  { text: 'Hidden Only', value: 'hidden' }
]

// Computed
const recipes = computed(() => adminStore.recipes)
const totalRecipes = computed(() => adminStore.totalRecipes)
const loading = computed(() => adminStore.loading)

// Methods
function formatDate(dateString: string) {
  return format(new Date(dateString), 'PP')
}

async function loadRecipes() {
  await adminStore.fetchRecipesForModeration(options.value.page)
}

function openHideDialog(recipe: Recipe) {
  selectedRecipe.value = recipe
  hideReason.value = ''
  hideDialog.value = true
}

async function hideRecipe() {
  if (!selectedRecipe.value) return
  
  try {
    await adminStore.hideRecipe(selectedRecipe.value.id, hideReason.value)
    hideDialog.value = false
    notificationStore.showSuccess('Recipe hidden successfully')
  } catch (error) {
    notificationStore.showError('Failed to hide recipe')
  }
}

async function unhideRecipe(recipe: Recipe) {
  try {
    await adminStore.unhideRecipe(recipe.id)
    notificationStore.showSuccess('Recipe unhidden successfully')
  } catch (error) {
    notificationStore.showError('Failed to unhide recipe')
  }
}

function openDeleteDialog(recipe: Recipe) {
  selectedRecipe.value = recipe
  deleteDialog.value = true
}

async function deleteRecipe() {
  if (!selectedRecipe.value) return
  
  try {
    await adminStore.deleteRecipe(selectedRecipe.value.id)
    deleteDialog.value = false
    notificationStore.showSuccess('Recipe deleted successfully')
  } catch (error) {
    notificationStore.showError('Failed to delete recipe')
  }
}

// Lifecycle
onMounted(() => {
  loadRecipes()
})
</script>