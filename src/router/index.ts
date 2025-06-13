import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: () => import('../views/LandingView.vue') },
        { path: 'recipes', name: 'recipes', component: () => import('../views/RecipeListView.vue') },
        { path: 'recipes/:id', name: 'recipe-detail', component: () => import('../views/RecipeDetailView.vue') },
        { path: 'recipes/:id/edit', name: 'recipe-edit', component: () => import('../views/RecipeCreateView.vue') },
        { path: 'profile/edit', name: 'profile-edit', component: () => import('../views/EditProfileView.vue') }
      ]
    },
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') },
        { path: 'register', name: 'register', component: () => import('../views/RegisterView.vue') }
      ]
    }
  ]
})

export default router
