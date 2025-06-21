<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Admin Dashboard</h1>
      </v-col>
    </v-row>

    <!-- Platform Statistics -->
    <v-row v-if="platformStats">
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h2 font-weight-bold primary--text">
              {{ platformStats.total_users }}
            </div>
            <div class="text-body-1">Total Users</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h2 font-weight-bold success--text">
              {{ platformStats.active_users_30d }}
            </div>
            <div class="text-body-1">Active Users (30d)</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h2 font-weight-bold info--text">
              {{ platformStats.total_recipes }}
            </div>
            <div class="text-body-1">Total Recipes</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h2 font-weight-bold warning--text">
              {{ platformStats.recipes_today }}
            </div>
            <div class="text-body-1">Recipes Today</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mt-4">
      <v-col cols="12">
        <h2 class="text-h5 mb-3">Quick Actions</h2>
      </v-col>
      <v-col cols="12" md="4">
        <v-card to="/admin/users" link>
          <v-card-text class="d-flex align-center">
            <v-icon large class="mr-4">mdi-account-group</v-icon>
            <div>
              <div class="text-h6">Manage Users</div>
              <div class="text-body-2">View and manage user accounts</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card to="/admin/recipes" link>
          <v-card-text class="d-flex align-center">
            <v-icon large class="mr-4">mdi-food</v-icon>
            <div>
              <div class="text-h6">Moderate Recipes</div>
              <div class="text-body-2">Review and moderate recipe content</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card to="/admin/analytics" link>
          <v-card-text class="d-flex align-center">
            <v-icon large class="mr-4">mdi-chart-line</v-icon>
            <div>
              <div class="text-h6">View Analytics</div>
              <div class="text-body-2">Platform statistics and trends</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Admin Actions -->
    <v-row class="mt-4">
      <v-col cols="12">
        <h2 class="text-h5 mb-3">Recent Admin Actions</h2>
        <v-card>
          <v-data-table
            :headers="actionHeaders"
            :items="adminActions"
            :loading="loading"
            :server-items-length="totalActions"
            v-model:options="actionOptions"
            @update:options="loadAdminActions"
            class="elevation-1"
          >
            <template #[`item.admin.name`]="{ item }">
              {{ item.admin?.name || item.admin_id }}
            </template>
            <template #[`item.created_at`]="{ item }">
              {{ formatDate(item.created_at) }}
            </template>
            <template #[`item.action`]="{ item }">
              <v-chip small :color="getActionColor(item.action)">
                {{ item.action }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Top Users -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <h2 class="text-h5 mb-3">Top Contributors</h2>
        <v-card>
          <v-list>
            <v-list-item
              v-for="user in topUsers"
              :key="user.user_id"
              :to="`/admin/users/${user.user_id}`"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ user.username || user.email }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ user.recipe_count }} recipes
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import { format } from 'date-fns'

const adminStore = useAdminStore()

// Data table options
const actionOptions = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
  groupBy: [],
  groupDesc: [],
  multiSort: false,
  mustSort: false
})

const actionHeaders = [
  { text: 'Admin', value: 'admin.name' },
  { text: 'Action', value: 'action' },
  { text: 'Target Type', value: 'target_type' },
  { text: 'Date', value: 'created_at' }
]

// Computed properties
const platformStats = computed(() => adminStore.platformStats)
const adminActions = computed(() => adminStore.adminActions)
const totalActions = computed(() => adminStore.totalActions)
const topUsers = computed(() => adminStore.topUsers)
const loading = computed(() => adminStore.loading)

// Methods
function formatDate(dateString: string) {
  return format(new Date(dateString), 'PPp')
}

function getActionColor(action: string) {
  if (action.includes('delete')) return 'error'
  if (action.includes('ban')) return 'warning'
  if (action.includes('update')) return 'info'
  if (action.includes('create')) return 'success'
  return 'default'
}

async function loadAdminActions() {
  await adminStore.fetchAdminActions(actionOptions.value.page)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    adminStore.fetchPlatformStats(),
    adminStore.fetchAdminActions(1),
    adminStore.fetchTopUsers(5)
  ])
})
</script>