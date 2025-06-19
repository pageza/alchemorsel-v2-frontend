<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">User Management</h1>
      </v-col>
    </v-row>

    <!-- Search and Actions -->
    <v-row>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="searchQuery"
          label="Search users by email, name, or username"
          prepend-inner-icon="mdi-magnify"
          clearable
          @keyup.enter="searchUsers"
          @click:clear="clearSearch"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          color="primary"
          block
          @click="searchUsers"
        >
          Search
        </v-btn>
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="users"
            :loading="loading"
            :server-items-length="totalUsers"
            :options.sync="options"
            @update:options="loadUsers"
            class="elevation-1"
          >
            <template #[`item.profile.username`]="{ item }">
              {{ item.profile?.username || '-' }}
            </template>
            <template #[`item.role`]="{ item }">
              <v-chip
                small
                :color="getRoleColor(item.role)"
              >
                {{ item.role }}
              </v-chip>
            </template>
            <template #[`item.is_banned`]="{ item }">
              <v-chip
                v-if="item.is_banned"
                small
                color="error"
              >
                Banned
              </v-chip>
              <v-chip
                v-else
                small
                color="success"
              >
                Active
              </v-chip>
            </template>
            <template #[`item.created_at`]="{ item }">
              {{ formatDate(item.created_at) }}
            </template>
            <template #[`item.actions`]="{ item }">
              <v-menu offset-y>
                <template #activator="{ props }">
                  <v-btn
                    icon
                    v-bind="props"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="viewUserDetails(item)">
                    <v-list-item-icon>
                      <v-icon>mdi-account-details</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>View Details</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openRoleDialog(item)">
                    <v-list-item-icon>
                      <v-icon>mdi-shield-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Change Role</v-list-item-title>
                  </v-list-item>
                  <v-divider />
                  <v-list-item
                    v-if="!item.is_banned"
                    @click="openBanDialog(item)"
                  >
                    <v-list-item-icon>
                      <v-icon color="warning">mdi-account-cancel</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Ban User</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-else
                    @click="unbanUser(item)"
                  >
                    <v-list-item-icon>
                      <v-icon color="success">mdi-account-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Unban User</v-list-item-title>
                  </v-list-item>
                  <v-divider />
                  <v-list-item @click="openDeleteDialog(item)">
                    <v-list-item-icon>
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Delete User</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- User Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="600">
      <v-card v-if="selectedUser">
        <v-card-title>
          User Details
          <v-spacer />
          <v-btn icon @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>ID</v-list-item-subtitle>
                <v-list-item-title>{{ selectedUser.id }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Email</v-list-item-subtitle>
                <v-list-item-title>{{ selectedUser.email }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Name</v-list-item-subtitle>
                <v-list-item-title>{{ selectedUser.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Username</v-list-item-subtitle>
                <v-list-item-title>{{ selectedUser.profile?.username || '-' }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Role</v-list-item-subtitle>
                <v-list-item-title>{{ selectedUser.role }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="userStats">
              <v-list-item-content>
                <v-list-item-subtitle>Statistics</v-list-item-subtitle>
                <v-list-item-title>
                  {{ userStats.recipe_count }} recipes, 
                  {{ userStats.favorite_count }} favorites
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Change Role Dialog -->
    <v-dialog v-model="roleDialog" max-width="400">
      <v-card>
        <v-card-title>Change User Role</v-card-title>
        <v-card-text>
          <v-select
            v-model="newRole"
            :items="roles"
            label="Select new role"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="roleDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            @click="updateRole"
          >
            Update Role
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Ban User Dialog -->
    <v-dialog v-model="banDialog" max-width="400">
      <v-card>
        <v-card-title>Ban User</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="banReason"
            label="Reason for ban"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="banDialog = false">Cancel</v-btn>
          <v-btn
            color="warning"
            :loading="loading"
            @click="banUser"
          >
            Ban User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete User Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete User</v-card-title>
        <v-card-text>
          Are you sure you want to permanently delete this user? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            :loading="loading"
            @click="deleteUser"
          >
            Delete User
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
import type { User } from '@/types'

const adminStore = useAdminStore()
const notificationStore = useNotificationStore()

// State
const searchQuery = ref('')
const selectedUser = ref<User | null>(null)
const userStats = ref<any>(null)
const detailsDialog = ref(false)
const roleDialog = ref(false)
const banDialog = ref(false)
const deleteDialog = ref(false)
const newRole = ref('')
const banReason = ref('')

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
  { text: 'Email', value: 'email' },
  { text: 'Name', value: 'name' },
  { text: 'Username', value: 'profile.username' },
  { text: 'Role', value: 'role' },
  { text: 'Status', value: 'is_banned' },
  { text: 'Created', value: 'created_at' },
  { text: 'Actions', value: 'actions', sortable: false }
]

const roles = ['user', 'moderator', 'admin']

// Computed
const users = computed(() => adminStore.users)
const totalUsers = computed(() => adminStore.totalUsers)
const loading = computed(() => adminStore.loading)

// Methods
function formatDate(dateString: string) {
  return format(new Date(dateString), 'PP')
}

function getRoleColor(role: string) {
  switch (role) {
    case 'admin':
      return 'error'
    case 'moderator':
      return 'warning'
    default:
      return 'default'
  }
}

async function loadUsers() {
  await adminStore.fetchUsers(options.value.page, searchQuery.value)
}

async function searchUsers() {
  options.value.page = 1
  await loadUsers()
}

function clearSearch() {
  searchQuery.value = ''
  searchUsers()
}

async function viewUserDetails(user: User) {
  selectedUser.value = user
  detailsDialog.value = true
  try {
    const response = await adminStore.getUserDetails(user.id)
    userStats.value = response.stats
  } catch (error) {
    notificationStore.showError('Failed to load user details')
  }
}

function openRoleDialog(user: User) {
  selectedUser.value = user
  newRole.value = user.role
  roleDialog.value = true
}

async function updateRole() {
  if (!selectedUser.value) return
  
  try {
    await adminStore.updateUserRole(selectedUser.value.id, newRole.value)
    roleDialog.value = false
    notificationStore.showSuccess('User role updated successfully')
  } catch (error) {
    notificationStore.showError('Failed to update user role')
  }
}

function openBanDialog(user: User) {
  selectedUser.value = user
  banReason.value = ''
  banDialog.value = true
}

async function banUser() {
  if (!selectedUser.value || !banReason.value) return
  
  try {
    await adminStore.banUser(selectedUser.value.id, banReason.value)
    banDialog.value = false
    notificationStore.showSuccess('User banned successfully')
  } catch (error) {
    notificationStore.showError('Failed to ban user')
  }
}

async function unbanUser(user: User) {
  try {
    await adminStore.unbanUser(user.id)
    notificationStore.showSuccess('User unbanned successfully')
  } catch (error) {
    notificationStore.showError('Failed to unban user')
  }
}

function openDeleteDialog(user: User) {
  selectedUser.value = user
  deleteDialog.value = true
}

async function deleteUser() {
  if (!selectedUser.value) return
  
  try {
    await adminStore.deleteUser(selectedUser.value.id)
    deleteDialog.value = false
    notificationStore.showSuccess('User deleted successfully')
  } catch (error) {
    notificationStore.showError('Failed to delete user')
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>