import { useNotificationStore } from '@/stores/notification.store'

/**
 * Composable for triggering notification messages.
 */
export function useNotification() {
  const store = useNotificationStore()
  return {
    success: store.success,
    error: store.error,
    info: store.info,
    warning: store.warning,
  }
}