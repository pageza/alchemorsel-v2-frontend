// In a browser environment, we'll use environment variables
// Docker secrets will be injected at build time
export const secrets = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  appTitle: import.meta.env.VITE_APP_TITLE || 'Alchemorsel'
} 