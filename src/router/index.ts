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
        { path: 'about', name: 'about', component: () => import('../views/AboutView.vue') },
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
        { path: 'register', name: 'register', component: () => import('../views/RegisterView.vue') },
        { path: 'forgot-password', name: 'forgot-password', component: () => import('../views/ForgotPasswordView.vue') },
        { path: 'reset-password', name: 'reset-password', component: () => import('../views/ResetPasswordView.vue') },
        { path: 'verify-email', name: 'verify-email', component: () => import('../views/VerifyEmailView.vue') }
      ]
    },
    // Authenticated user routes
    {
      path: '/',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
        { 
          path: 'generate', 
          name: 'generate', 
          component: () => import('../views/RecipeGeneratorView.vue'),
          meta: { requiresEmailVerification: true }
        },
        { path: 'favorites', name: 'favorites', component: () => import('../views/FavoritesView.vue') },
        { path: 'profile', name: 'profile', component: () => import('../views/ProfileView.vue') },
        { path: 'profile/edit', name: 'profile-edit', component: () => import('../views/EditProfileView.vue') },
        { 
          path: 'recipes/create', 
          name: 'recipe-create', 
          component: () => import('../views/RecipeCreateView.vue'),
          meta: { requiresEmailVerification: true }
        },
        { 
          path: 'recipes/:id/edit', 
          name: 'recipe-edit', 
          component: () => import('../views/RecipeCreateView.vue'),
          meta: { requiresEmailVerification: true }
        }
      ]
    },
    // Admin routes
    {
      path: '/admin',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboard.vue') },
        { path: 'users', name: 'admin-users', component: () => import('../views/admin/UserManagement.vue') },
        { path: 'users/:id', name: 'admin-user-detail', component: () => import('../views/admin/UserManagement.vue') },
        { path: 'recipes', name: 'admin-recipes', component: () => import('../views/admin/RecipeModeration.vue') },
        { path: 'analytics', name: 'admin-analytics', component: () => import('../views/admin/AdminAnalytics.vue') }
      ]
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  console.log(`🛡️ Router guard: ${String(from.name) || from.path || 'unknown'} → ${String(to.name) || to.path || 'unknown'}`)
  console.log(`🛡️ From path: ${from.path}, To path: ${to.path}`)
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresEmailVerification = to.matched.some(record => record.meta.requiresEmailVerification)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  console.log(`🛡️ Route requires - Auth: ${requiresAuth}, Email: ${requiresEmailVerification}, Admin: ${requiresAdmin}`)
  
  // Get user authentication state
  const token = localStorage.getItem('auth_token')
  let user = null
  try {
    const userStr = localStorage.getItem('auth_user')
    if (userStr) {
      user = JSON.parse(userStr)
    }
  } catch (e) {
    console.error('🛡️ Error parsing user data:', e)
  }
  
  const isAuthenticated = !!token
  const isEmailVerified = user?.email_verified || false
  const isAdmin = user?.role === 'admin'
  
  console.log(`🛡️ User state - Auth: ${isAuthenticated}, Email verified: ${isEmailVerified}, Admin: ${isAdmin}`)
  
  // Public routes that everyone can access
  const publicRoutes = ['home', 'about', 'recipes', 'recipe-detail']
  const authRoutes = ['login', 'register', 'forgot-password', 'reset-password', 'verify-email']
  const isPublicRoute = publicRoutes.includes(to.name as string)
  const isAuthRoute = authRoutes.includes(to.name as string)
  
  // Unauthenticated users: only landing, about, auth pages, and public recipe views
  if (!isAuthenticated) {
    if (isPublicRoute || isAuthRoute) {
      console.log('🛡️ Unauthenticated user accessing public/auth route - allowed')
      next()
      return
    } else {
      console.log('🛡️ Unauthenticated user trying to access protected route, redirecting to home')
      next({ name: 'home' })
      return
    }
  }
  
  // Authenticated users trying to access auth pages
  if (isAuthenticated && isAuthRoute && to.name !== 'verify-email') {
    console.log('🛡️ Authenticated user trying to access auth page, redirecting to dashboard')
    next({ name: 'dashboard' })
    return
  }
  
  // Admin role check
  if (requiresAdmin && !isAdmin) {
    console.log('🛡️ Non-admin user trying to access admin route, redirecting to dashboard')
    next({ name: 'dashboard' })
    return
  }
  
  // Email verification check for specific routes
  if (requiresEmailVerification && !isEmailVerified) {
    console.log('🛡️ Unverified user trying to access email-required route, redirecting to dashboard with notification')
    // Allow the navigation but the component will handle the verification requirement
    // This way users can see the "verify email" message in context
    next()
    return
  }
  
  // Authentication check for protected routes
  if (requiresAuth && !isAuthenticated) {
    console.log('🛡️ Route requires auth but user not authenticated, redirecting to login')
    next({ name: 'login' })
    return
  }
  
  console.log('🛡️ Navigation allowed')
  next()
})

export default router
