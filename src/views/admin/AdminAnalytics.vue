<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Platform Analytics</h1>
      </v-col>
    </v-row>

    <!-- Platform Overview -->
    <v-row v-if="platformStats">
      <v-col cols="12">
        <h2 class="text-h5 mb-3">Platform Overview</h2>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h3 font-weight-bold">{{ platformStats.total_users }}</div>
                <div class="text-subtitle-1">Total Users</div>
              </div>
              <v-icon large color="primary">mdi-account-group</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h3 font-weight-bold">{{ platformStats.active_users_30d }}</div>
                <div class="text-subtitle-1">Active Users (30d)</div>
              </div>
              <v-icon large color="success">mdi-account-check</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h3 font-weight-bold">{{ platformStats.banned_users }}</div>
                <div class="text-subtitle-1">Banned Users</div>
              </div>
              <v-icon large color="error">mdi-account-cancel</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h3 font-weight-bold">{{ platformStats.total_recipes }}</div>
                <div class="text-subtitle-1">Total Recipes</div>
              </div>
              <v-icon large color="info">mdi-food</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h3 font-weight-bold">{{ platformStats.recipes_today }}</div>
                <div class="text-subtitle-1">Recipes Today</div>
              </div>
              <v-icon large color="warning">mdi-new-box</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h3 font-weight-bold">{{ platformStats.total_favorites }}</div>
                <div class="text-subtitle-1">Total Favorites</div>
              </div>
              <v-icon large color="pink">mdi-heart</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Activity Trends -->
    <v-row class="mt-6">
      <v-col cols="12">
        <h2 class="text-h5 mb-3">Activity Trends</h2>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="trendDays"
                  :items="trendOptions"
                  label="Time Period"
                  @change="loadDailyStats"
                />
              </v-col>
            </v-row>
            <canvas ref="chartCanvas" height="100"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Top Contributors -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <h2 class="text-h5 mb-3">Top Contributors</h2>
        <v-card>
          <v-data-table
            :headers="userHeaders"
            :items="topUsers"
            :loading="loading"
            hide-default-footer
            class="elevation-1"
          >
            <template #[`item.username`]="{ item }">
              <router-link
                :to="`/admin/users/${item.user_id}`"
                class="text-decoration-none"
              >
                {{ item.username || item.email }}
              </router-link>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Recent Activity Summary -->
      <v-col cols="12" md="6">
        <h2 class="text-h5 mb-3">Activity Summary</h2>
        <v-card>
          <v-list>
            <v-list-item v-if="recentStats">
              <v-list-item-icon>
                <v-icon color="primary">mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ recentStats.new_users_7d }} new users</v-list-item-title>
                <v-list-item-subtitle>Last 7 days</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="recentStats">
              <v-list-item-icon>
                <v-icon color="info">mdi-chef-hat</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ recentStats.new_recipes_7d }} new recipes</v-list-item-title>
                <v-list-item-subtitle>Last 7 days</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="recentStats">
              <v-list-item-icon>
                <v-icon color="pink">mdi-heart</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ recentStats.new_favorites_7d }} new favorites</v-list-item-title>
                <v-list-item-subtitle>Last 7 days</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import Chart from 'chart.js/auto'

const adminStore = useAdminStore()

// State
const trendDays = ref(30)
const chartInstance = ref<Chart | null>(null)
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const recentStats = ref<any>(null)

const trendOptions = [
  { text: 'Last 7 days', value: 7 },
  { text: 'Last 30 days', value: 30 },
  { text: 'Last 60 days', value: 60 },
  { text: 'Last 90 days', value: 90 }
]

const userHeaders = [
  { text: 'User', value: 'username' },
  { text: 'Recipes', value: 'recipe_count' }
]

// Computed
const platformStats = computed(() => adminStore.platformStats)
const dailyStats = computed(() => adminStore.dailyStats)
const topUsers = computed(() => adminStore.topUsers)
const loading = computed(() => adminStore.loading)

// Methods
async function loadDailyStats() {
  await adminStore.fetchDailyStats(trendDays.value)
  updateChart()
}

function calculateRecentStats() {
  if (!dailyStats.value || dailyStats.value.length === 0) return
  
  const last7Days = dailyStats.value.slice(0, 7)
  
  recentStats.value = {
    new_users_7d: last7Days.reduce((sum, day) => sum + day.new_users, 0),
    new_recipes_7d: last7Days.reduce((sum, day) => sum + day.new_recipes, 0),
    new_favorites_7d: last7Days.reduce((sum, day) => sum + day.new_favorites, 0)
  }
}

async function updateChart() {
  await nextTick()
  
  if (!chartCanvas.value || !dailyStats.value) return
  
  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return
  
  // Prepare data
  const labels = dailyStats.value.map(stat => stat.date).reverse()
  const usersData = dailyStats.value.map(stat => stat.new_users).reverse()
  const recipesData = dailyStats.value.map(stat => stat.new_recipes).reverse()
  const favoritesData = dailyStats.value.map(stat => stat.new_favorites).reverse()
  
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: usersData,
          borderColor: 'rgb(25, 118, 210)',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.1
        },
        {
          label: 'New Recipes',
          data: recipesData,
          borderColor: 'rgb(56, 142, 60)',
          backgroundColor: 'rgba(56, 142, 60, 0.1)',
          tension: 0.1
        },
        {
          label: 'New Favorites',
          data: favoritesData,
          borderColor: 'rgb(244, 67, 54)',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  })
}

// Watchers
watch(dailyStats, () => {
  calculateRecentStats()
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    adminStore.fetchPlatformStats(),
    adminStore.fetchDailyStats(trendDays.value),
    adminStore.fetchTopUsers(10)
  ])
  
  calculateRecentStats()
  updateChart()
})
</script>