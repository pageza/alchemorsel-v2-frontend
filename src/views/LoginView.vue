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
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2 class="welcome-title">Welcome Back</h2>
          <p class="welcome-subtitle">Sign in to continue to Alchemorsel</p>
        </div>
      </template>

      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        @submit.prevent="handleSubmit"
        data-testid="login-form"
      >
        <el-form-item prop="email">
          <el-input
            v-model="formData.email"
            type="email"
            placeholder="Email"
            :prefix-icon="Message"
            data-testid="email-input"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            :prefix-icon="Lock"
            :suffix-icon="showPassword ? View : Hide"
            @click:suffix-icon="showPassword = !showPassword"
            data-testid="password-input"
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="formData.rememberMe" data-testid="remember-me">Remember me</el-checkbox>
          <el-button
            type="primary"
            link
            @click="handleForgotPassword"
            data-testid="forgot-password"
          >
            Forgot Password?
          </el-button>
        </div>

        <el-button
          type="primary"
          native-type="submit"
          :loading="isLoading"
          class="submit-button"
          data-testid="login-submit"
        >
          Sign In
        </el-button>

        <el-divider>
          <span class="divider-text">or continue with</span>
        </el-divider>

        <div class="social-buttons">
          <el-button
            class="social-button"
            @click="handleSocialLogin('google')"
            data-testid="google-login"
          >
            <el-icon><ChromeFilled /></el-icon>
            Google
          </el-button>
          <el-button
            class="social-button"
            @click="handleSocialLogin('github')"
            data-testid="github-login"
          >
            <el-icon><Platform /></el-icon>
            GitHub
          </el-button>
        </div>

        <div class="signup-prompt">
          <span>Don't have an account?</span>
          <el-button
            type="primary"
            link
            @click="$router.push('/register')"
            data-testid="register-link"
          >
            Sign Up
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Lock, View, Hide, ChromeFilled, Platform } from '@element-plus/icons-vue'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const { login } = useAuth()
const { success, error: errorNotification } = useNotification()

const router = useRouter()
const form = ref(null)
const isLoading = ref(false)
const showPassword = ref(false)

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' }
  ]
}

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
    await form.value.validate()
    console.log('Form validated, starting login...')
    isLoading.value = true
    await login({
      email: formData.email,
      password: formData.password,
    })
    success('Logged in successfully')
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    
    let errorMessage = 'Failed to login. Please try again.'
    
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      errorMessage = 'Backend server is not running. Please start the backend service.'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    errorNotification(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  // TODO: Implement forgot password flow
}

const handleSocialLogin = (provider: string) => {
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
}

.login-card {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
}

.card-header {
  text-align: center;
  padding: 24px 0;
}

.welcome-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.welcome-subtitle {
  color: var(--el-text-color-secondary);
  margin: 8px 0 0;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.submit-button {
  width: 100%;
  margin-bottom: 24px;
}

.divider-text {
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
}

.social-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.social-button {
  flex: 1;
}

.signup-prompt {
  text-align: center;
  color: var(--el-text-color-secondary);
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}
</style> 