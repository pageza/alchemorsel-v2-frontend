<template>
  <div class="register-page">
    <div class="register-container">
      <h2>Create Your Account</h2>
      
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
        class="register-form"
        data-testid="register-form"
      >
        <!-- Basic Information -->
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="formData.email"
            type="email"
            placeholder="your@email.com"
            size="large"
            data-testid="email-input"
          />
        </el-form-item>

        <el-form-item label="Username" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="johndoe"
            size="large"
            data-testid="username-input"
          />
        </el-form-item>

        <el-form-item label="Full Name" prop="full_name">
          <el-input
            v-model="formData.full_name"
            placeholder="John Doe"
            size="large"
            data-testid="fullname-input"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            size="large"
            show-password
            data-testid="password-input"
          />
          <div class="password-hint">
            Min 8 chars, 1 uppercase, 1 number, 1 special char
          </div>
        </el-form-item>

        <!-- Dietary Preferences -->
        <el-form-item label="Dietary Preferences">
          <div class="checkbox-group" data-testid="dietary-preferences">
            <el-checkbox
              v-for="preference in dietaryOptions"
              :key="preference"
              v-model="formData.dietary_preferences"
              :value="preference"
              :label="preference"
              :data-testid="`dietary-${preference.toLowerCase()}`"
            />
          </div>
        </el-form-item>

        <!-- Allergies -->
        <el-form-item label="Allergies">
          <div class="checkbox-group" data-testid="allergies">
            <el-checkbox
              v-for="allergy in allergyOptions"
              :key="allergy"
              v-model="formData.allergies"
              :value="allergy"
              :label="allergy"
              :data-testid="`allergy-${allergy.toLowerCase().replace(/\s+/g, '-')}`"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="isLoading"
            @click="handleSubmit"
            style="width: 100%"
            data-testid="register-submit"
          >
            Sign Up
          </el-button>
        </el-form-item>

        <div class="login-link">
          Already have an account? 
          <el-button 
            type="primary" 
            link 
            @click="$router.push('/login')"
            data-testid="login-link"
          >
            Login
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import type { ElForm } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref<InstanceType<typeof ElForm>>()
const isLoading = ref(false)

const formData = reactive({
  email: '',
  username: '',
  full_name: '',
  password: '',
  dietary_preferences: [] as string[],
  allergies: [] as string[]
})

const dietaryOptions = [
  'Vegan',
  'Vegetarian', 
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo'
]

const allergyOptions = [
  'Peanuts',
  'Tree Nuts',
  'Shellfish',
  'Soy',
  'Eggs',
  'Dairy'
]

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  username: [
    { required: true, message: 'Username is required', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' }
  ],
  full_name: [
    { required: true, message: 'Full name is required', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!form.value) return
  
  try {
    const valid = await form.value.validate()
    if (!valid) return
    
    isLoading.value = true
    
    await authStore.register({
      email: formData.email,
      username: formData.username,
      name: formData.full_name,
      password: formData.password,
      dietary_preferences: formData.dietary_preferences,
      allergies: formData.allergies
    })
    
    notificationStore.success('Registration successful! Welcome to Alchemorsel!')
    router.push('/dashboard')
    
  } catch (error: unknown) {
    console.error('Registration error:', error)
    
    let errorMessage = 'Registration failed. Please try again.'
    
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      errorMessage = 'Backend server is not running. Please start the backend service.'
    } else if (error.response?.data?.error === 'user already exists') {
      errorMessage = 'An account with this email already exists. Please use a different email or try logging in.'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    
    notificationStore.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.register-container {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.register-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 1.75rem;
}

.register-form {
  width: 100%;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 8px;
}

.checkbox-group .el-checkbox {
  margin-right: 0;
  margin-bottom: 8px;
}

.password-hint {
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-top: 5px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: 500;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .register-page {
    padding: 20px 15px;
  }
  
  .register-container {
    padding: 30px 20px;
  }
  
  .register-container h2 {
    font-size: 1.5rem;
  }
  
  .checkbox-group {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 20px 15px;
  }
  
  .checkbox-group {
    gap: 8px;
  }
}
</style> 