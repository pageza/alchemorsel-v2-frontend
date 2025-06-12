<template>
  <div>
    <!-- Vuetify Forms -->
    <template v-if="uiStore.useVuetify">
      <v-card class="mx-auto" max-width="400">
        <v-tabs v-model="activeTab" grow>
          <v-tab value="login">Login</v-tab>
          <v-tab value="register">Register</v-tab>
        </v-tabs>

        <v-card-text>
          <!-- Login Form -->
          <v-form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="mt-4">
            <v-text-field
              v-model="loginForm.email"
              label="Email"
              type="email"
              :rules="[
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
              ]"
              required
            ></v-text-field>

            <v-text-field
              v-model="loginForm.password"
              label="Password"
              type="password"
              :rules="[v => !!v || 'Password is required']"
              required
            ></v-text-field>

            <div class="d-flex justify-space-between align-center mt-2">
              <v-checkbox
                v-model="loginForm.rememberMe"
                label="Remember me"
                hide-details
              ></v-checkbox>
              <v-btn
                variant="text"
                color="primary"
                @click="handleForgotPassword"
              >
                Forgot Password?
              </v-btn>
            </div>

            <v-btn
              type="submit"
              color="primary"
              block
              class="mt-4"
              :loading="isSubmitting"
            >
              Login
            </v-btn>
          </v-form>

          <!-- Registration Form -->
          <v-form v-else @submit.prevent="handleRegister" class="mt-4">
            <v-text-field
              v-model="registerForm.name"
              label="Full Name"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>

            <v-text-field
              v-model="registerForm.email"
              label="Email"
              type="email"
              :rules="[
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
              ]"
              required
            ></v-text-field>

            <v-text-field
              v-model="registerForm.password"
              label="Password"
              type="password"
              :rules="[
                v => !!v || 'Password is required',
                v => v.length >= 8 || 'Password must be at least 8 characters'
              ]"
              required
            ></v-text-field>

            <v-text-field
              v-model="registerForm.confirmPassword"
              label="Confirm Password"
              type="password"
              :rules="[
                v => !!v || 'Please confirm your password',
                v => v === registerForm.password || 'Passwords do not match'
              ]"
              required
            ></v-text-field>

            <v-checkbox
              v-model="registerForm.acceptTerms"
              label="I accept the terms and conditions"
              :rules="[v => !!v || 'You must accept the terms to continue']"
              required
            ></v-checkbox>

            <v-btn
              type="submit"
              color="primary"
              block
              class="mt-4"
              :loading="isSubmitting"
            >
              Register
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </template>

    <!-- Tailwind Forms -->
    <template v-else>
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="flex border-b">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-4 text-center font-medium text-sm',
              activeTab === 'login'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Login
          </button>
          <button
            @click="activeTab = 'register'"
            :class="[
              'flex-1 py-4 text-center font-medium text-sm',
              activeTab === 'register'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Register
          </button>
        </div>

        <div class="p-6">
          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="login-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="login-email"
                v-model="loginForm.email"
                type="email"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label for="login-password" class="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="login-password"
                v-model="loginForm.password"
                type="password"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="loginForm.rememberMe"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <button
                type="button"
                @click="handleForgotPassword"
                class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Login
            </button>
          </form>

          <!-- Registration Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label for="register-name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="register-name"
                v-model="registerForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label for="register-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="register-email"
                v-model="registerForm.email"
                type="email"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label for="register-password" class="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="register-password"
                v-model="registerForm.password"
                type="password"
                required
                minlength="8"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label for="register-confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="register-confirm-password"
                v-model="registerForm.confirmPassword"
                type="password"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-center">
              <input
                id="terms"
                v-model="registerForm.acceptTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                I accept the <a href="#" class="text-indigo-600 hover:text-indigo-500">terms and conditions</a>
              </label>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Register
            </button>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const activeTab = ref('login')
const isSubmitting = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const handleLogin = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement login logic
    console.log('Login form submitted:', loginForm)
    // Reset form after successful submission
    Object.keys(loginForm).forEach(key => {
      if (key === 'rememberMe') {
        loginForm[key] = false
      } else {
        loginForm[key] = ''
      }
    })
  } catch (error) {
    console.error('Error during login:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleRegister = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement registration logic
    console.log('Registration form submitted:', registerForm)
    // Reset form after successful submission
    Object.keys(registerForm).forEach(key => {
      if (key === 'acceptTerms') {
        registerForm[key] = false
      } else {
        registerForm[key] = ''
      }
    })
  } catch (error) {
    console.error('Error during registration:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleForgotPassword = () => {
  // TODO: Implement forgot password logic
  console.log('Forgot password clicked')
}
</script> 