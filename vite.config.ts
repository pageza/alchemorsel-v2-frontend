import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
// ESLINT-FIX-2025-I: Remove unused auto-import plugins that aren't being used
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('🔧 Vite config mode:', mode)
  console.log('🔧 Vite config env.VITE_BACKEND_URL:', env.VITE_BACKEND_URL)
  console.log('🔧 Process env VITE_BACKEND_URL:', process.env.VITE_BACKEND_URL)
  
  const proxyTarget = env.VITE_BACKEND_URL || 'http://localhost:8080'
  console.log('🔧 Proxy target will be:', proxyTarget)
  
  return {
  define: {
    // Disable Vite's host checking completely
    __VITE_IS_SECURE_CONTEXT__: 'false',
    'process.env.DANGEROUSLY_DISABLE_HOST_CHECK': '"true"',
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    // Disable host checking completely  
    allowedHosts: true,
    hmr: {
      clientPort: 5173,
      host: 'localhost'
    },
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          console.log('🔧 Vite proxy configured for:', options.target)
          // Add error handling for proxy failures
          proxy.on('error', (err, req) => {
            console.error('🚨 Proxy error:', err.message)
            console.error('🚨 Target URL:', options.target || 'undefined')
            console.error('🚨 Request URL:', req.url)
          })
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('🔄 Proxying request:', req.method, req.url, '→', (options.target || '') + (req.url || ''))
          })
        }
      }
    }
  }
  }
})
