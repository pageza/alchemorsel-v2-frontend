<template>
  <div class="notification-container">
    <v-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      v-model="notification.show"
      :color="getColor(notification.type)"
      :timeout="notification.timeout || 5000"
      location="top right"
      :style="{ 'margin-top': `${getTopOffset(notification.id)}px` }"
      class="notification-snackbar"
      @update:model-value="(value) => !value && remove(notification.id)"
    >
      <div class="d-flex align-center">
        <v-icon 
          :icon="getIcon(notification.type)" 
          class="mr-2"
          size="small"
        />
        <span>{{ notification.message }}</span>
        <v-btn
          variant="text"
          icon="mdi-close"
          size="small"
          class="ml-2"
          @click="remove(notification.id)"
        />
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNotificationStore } from '@/stores/notification.store'

const notificationStore = useNotificationStore()

// Create reactive copies of notifications with show state
const notifications = ref<Array<{
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
  show: boolean
}>>([])

// Watch for new notifications from the store
watch(
  () => notificationStore.notifications,
  (newNotifications) => {
    // Add new notifications that aren't already in our reactive list
    for (const notification of newNotifications) {
      if (!notifications.value.find(n => n.id === notification.id)) {
        notifications.value.push({
          ...notification,
          show: true
        })
      }
    }
    
    // Remove notifications that are no longer in the store
    notifications.value = notifications.value.filter(n => 
      newNotifications.find(storeN => storeN.id === n.id)
    )
  },
  { deep: true, immediate: true }
)

const getColor = (type: string) => {
  switch (type) {
    case 'success': return 'success'
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'info'
  }
}

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return 'mdi-check-circle'
    case 'error': return 'mdi-alert-circle'
    case 'warning': return 'mdi-alert'
    case 'info': return 'mdi-information'
    default: return 'mdi-information'
  }
}

const getTopOffset = (notificationId: number) => {
  const index = notifications.value.findIndex(n => n.id === notificationId)
  return index * 80 // Stack notifications with 80px spacing
}

const remove = (id: number) => {
  // Remove from our reactive list
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
  // Remove from store
  notificationStore.remove(id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification-snackbar {
  pointer-events: auto;
  position: relative !important;
  margin-bottom: 8px;
}

:deep(.v-snackbar__wrapper) {
  position: relative !important;
  min-width: 300px;
  max-width: 500px;
}

:deep(.v-snackbar__content) {
  padding: 12px 16px;
}
</style>