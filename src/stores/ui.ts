import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'alchemorsel-ui-preference'

export const useUIStore = defineStore('ui', () => {
  // Initialize from localStorage or default to Vuetify
  const useVuetify = ref(localStorage.getItem(STORAGE_KEY) !== 'false')

  // Watch for changes and persist to localStorage
  watch(useVuetify, (newValue) => {
    localStorage.setItem(STORAGE_KEY, String(newValue))
  })

  function toggleFramework() {
    useVuetify.value = !useVuetify.value
  }

  function setFramework(useVue: boolean) {
    useVuetify.value = useVue
  }

  return {
    useVuetify,
    toggleFramework,
    setFramework
  }
}) 