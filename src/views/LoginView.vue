<!--
TODO: INTERMITTENT LOGIN CONNECTION ISSUE
There appears to be an intermittent connection issue where the first login attempt fails with 
ERR_CONNECTION_REFUSED but the second attempt succeeds. This suggests a potential race condition 
or timing issue with:
1. Docker container networking/startup timing
2. Backend service readiness
3. API service initialization in frontend
4. CORS preflight request handling

This needs investigation to identify the root cause and implement a proper fix, potentially:
- Adding retry logic with exponential backoff
- Implementing proper service health checks
- Adding connection pooling or keep-alive
- Investigating Docker networking timing issues
-->

<template>
  <div class="login-container">
    <v-card class="login-card" elevation="4">
      <v-card-title class="card-header">
        <div>
          <h2 class="welcome-title">Welcome Back</h2>
          <p class="welcome-subtitle">Sign in to continue to Alchemorsel</p>
        </div>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
          data-testid="login-form"
        >
          <v-text-field
            v-model="formData.email"
            label="Email"
            type="email"
            placeholder="Email"
            variant="outlined"
            density="comfortable"
            :rules="emailRules"
            prepend-inner-icon="mdi-email"
            data-testid="email-input"
            class="mb-4"
          />

          <v-text-field
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Password"
            variant="outlined"
            density="comfortable"
            :rules="passwordRules"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            data-testid="password-input"
            class="mb-4"
          />

          <div class="form-options mb-6">
            <v-checkbox 
              v-model="formData.rememberMe" 
              label="Remember me"
              data-testid="remember-me"
              density="compact"
              hide-details
            />
            <v-btn
              variant="text"
              color="primary"
              @click="handleForgotPassword"
              data-testid="forgot-password"
              class="pa-0"
            >
              Forgot Password?
            </v-btn>
          </div>

          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="isLoading"
            :disabled="!isFormValid"
            block
            data-testid="login-submit"
            class="submit-button mb-6"
          >
            Sign In
          </v-btn>

          <!-- Social login temporarily hidden
          <v-divider class="mb-4">
            <span class="divider-text">or continue with</span>
          </v-divider>

          <div class="social-buttons mb-6">
            <v-btn
              variant="outlined"
              class="social-button"
              @click="handleSocialLogin"
              data-testid="google-login"
            >
              <v-icon start>mdi-google</v-icon>
              Google
            </v-btn>
            <v-btn
              variant="outlined"
              class="social-button"
              @click="handleSocialLogin"
              data-testid="github-login"
            >
              <v-icon start>mdi-github</v-icon>
              GitHub
            </v-btn>
          </div>
          -->

          <div class="signup-prompt">
            <span>Don't have an account?</span>
            <v-btn
              variant="text"
              color="primary"
              @click="$router.push('/register')"
              data-testid="register-link"
              class="pa-0 ml-1"
            >
              Sign Up
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const { login } = useAuth()
const { success, error: errorNotification } = useNotification()

const router = useRouter()
const form = ref()
const isLoading = ref(false)
const isFormValid = ref(false)
const showPassword = ref(false)

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required'
]

const handleSubmit = async () => {
  console.log('handleSubmit called!')
  console.log('Form data:', formData)
  console.log('Form ref:', form.value)
  console.trace('handleSubmit call stack')
  
  if (!form.value) {
    console.log('No form ref, returning')
    return
  }
  
  // Check if form has actual data
  if (!formData.email || !formData.password) {
    console.log('Form data is empty, not submitting')
    console.log('Email:', formData.email, 'Password:', formData.password ? '***' : 'empty')
    return
  }
  
  try {
    console.log('Validating form...')
    const { valid } = await form.value.validate()
    if (!valid) return
    console.log('Form validated, starting login...')
    isLoading.value = true
    await login({
      email: formData.email,
      password: formData.password,
    })
    success('Logged in successfully')
    router.push('/dashboard')
  } catch (error: unknown) {
    console.error('Login error:', error)
    
    let errorMessage = 'Failed to login. Please try again.'
    
    if (error && typeof error === 'object') {
      if ('code' in error) {
        const errorCode = (error as { code?: string }).code
        if (errorCode === 'ERR_NETWORK' || errorCode === 'ERR_CONNECTION_REFUSED') {
          errorMessage = 'Backend server is not running. Please start the backend service.'
        }
      } else if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        const responseData = error.response.data as { message?: string }
        if (responseData.message) {
          errorMessage = responseData.message
        }
      } else if ('message' in error && typeof (error as { message?: string }).message === 'string') {
        errorMessage = (error as { message: string }).message
      }
    }
    
    errorNotification(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  router.push('/forgot-password')
}

const handleSocialLogin = () => {
  // TODO: Implement social login
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f5f5;
}

.login-card {
  width: 100%;
  max-width: 500px;
}

.card-header {
  text-align: center;
  padding: 24px 0;
}

.welcome-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

.welcome-subtitle {
  color: #7f8c8d;
  margin: 8px 0 0;
  font-size: 0.9rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submit-button {
  width: 100%;
}

.divider-text {
  color: #7f8c8d;
  font-size: 0.875rem;
}

.social-buttons {
  display: flex;
  gap: 16px;
}

.social-button {
  flex: 1;
}

.signup-prompt {
  text-align: center;
  color: #7f8c8d;
}

/* Desktop-first responsive design */
@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    max-width: 100%;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .social-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .social-button {
    flex: 1 1 100%;
  }
}

@media (max-width: 480px) {
  .card-header {
    padding: 16px 0;
  }
  
  .welcome-title {
    font-size: 1.25rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style> 