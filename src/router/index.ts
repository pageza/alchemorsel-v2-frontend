/*
TODO: INTERMITTENT NAVIGATION ISSUE
There's a recurring issue where the first click on navigation links (buttons, router-links, etc.) 
just reloads the current page instead of navigating to the target route. The second click then 
works correctly. This suggests a potential issue with:

1. Vue Router initialization timing
2. Navigation guards interfering with first navigation attempt
3. Component lifecycle conflicts during route changes
4. Event handling/propagation issues with navigation elements
5. Potential race condition in router setup or authentication state

This affects multiple components across the app and needs systematic investigation:
- Check router guard logic for timing issues
- Verify navigation event handlers aren't being double-bound
- Investigate component mounting/unmounting lifecycle
- Consider adding navigation retry logic or debouncing
- Check for conflicting event listeners on navigation elements

Impact: Poor user experience requiring double-clicks to navigate
Priority: Medium-High (affects core navigation functionality)
*/

import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes (non-authenticated users)
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: () => import('../views/LandingView.vue') },
        { path: 'recipes', name: 'recipes', component: () => import('../views/RecipeListView.vue') },
        { path: 'recipes/:id', name: 'recipe-detail', component: () => import('../views/RecipeDetailView.vue') }
      ]
    },
    // Authentication routes
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') },
        { path: 'register', name: 'register', component: () => import('../views/RegisterView.vue') }
      ]
    },
    // Authenticated user routes
    {
      path: '/',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'generate', name: 'generate', component: () => import('../views/RecipeGeneratorView.vue') },
        { path: 'favorites', name: 'favorites', component: () => import('../views/FavoritesView.vue') },
        { path: 'profile/edit', name: 'profile-edit', component: () => import('../views/EditProfileView.vue') },
        { path: 'recipes/create', name: 'recipe-create', component: () => import('../views/RecipeCreateView.vue') },
        { path: 'recipes/:id/edit', name: 'recipe-edit', component: () => import('../views/RecipeCreateView.vue') }
      ]
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  console.log(`🛡️ Router guard: ${from.name || from.path || 'unknown'} → ${to.name || to.path || 'unknown'}`)
  console.log(`🛡️ From path: ${from.path}, To path: ${to.path}`)
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  console.log(`🛡️ Route requires auth: ${requiresAuth}`)
  
  if (requiresAuth) {
    // Check localStorage directly to avoid circular dependencies
    const token = localStorage.getItem('auth_token')
    console.log('🛡️ Route requires auth, token exists:', !!token)
    
    if (!token) {
      // Avoid infinite loops by checking if we're already going to login
      if (to.name !== 'login') {
        console.log('🛡️ No token, redirecting to login')
        next({ name: 'login' })
        return
      }
    }
  }
  
  // Check if user is authenticated but trying to access auth pages
  const token = localStorage.getItem('auth_token')
  if (token && (to.name === 'login' || to.name === 'register')) {
    console.log('🛡️ Authenticated user trying to access auth page, redirecting to dashboard')
    next({ name: 'dashboard' })
    return
  }
  
  console.log('🛡️ Navigation allowed')
  next()
})

export default router
