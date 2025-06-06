import { ref } from 'vue'

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const timeout = ref<number | null>(null)

  return ((...args: Parameters<T>) => {
    if (timeout.value) {
      clearTimeout(timeout.value)
    }

    timeout.value = window.setTimeout(() => {
      fn(...args)
      timeout.value = null
    }, delay)
  }) as T
} 