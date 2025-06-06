import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import RecipeView from '../views/RecipeView.vue'
import RecipeCreateView from '../views/RecipeCreateView.vue'
import RecipeDetailView from '../views/RecipeDetailView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: RecipeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/recipes/create',
    name: 'recipe-create',
    component: RecipeCreateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/recipes/:id',
    name: 'RecipeDetail',
    component: RecipeDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router  