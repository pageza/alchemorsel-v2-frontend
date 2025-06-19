import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  let nextId = 1

  function add(message: string, type: Notification['type'] = 'info', timeout = 5000): void {
    const id = nextId++
    const notification: Notification = { id, message, type, timeout }
    notifications.value.push(notification)

    if (timeout > 0) {
      setTimeout(() => {
        remove(id)
      }, timeout)
    }
  }

  function remove(id: number): void {
    const index = notifications.value.findIndex((n: Notification) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function success(message: string, timeout?: number): void {
    add(message, 'success', timeout)
  }

  function error(message: string, timeout?: number): void {
    add(message, 'error', timeout)
  }

  function info(message: string, timeout?: number): void {
    add(message, 'info', timeout)
  }

  function warning(message: string, timeout?: number): void {
    add(message, 'warning', timeout)
  }

  return {
    notifications,
    add,
    remove,
    success,
    error,
    info,
    warning,
    // Aliases for backward compatibility
    showSuccess: success,
    showError: error,
    showInfo: info,
    showWarning: warning
  }
}) 