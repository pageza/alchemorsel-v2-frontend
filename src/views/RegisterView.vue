<template>
  <div class="register-page">
    <div class="register-container">
      <h2>Create Your Account</h2>
      
      <v-form
        ref="form"
        v-model="isFormValid"
        @submit.prevent="handleSubmit"
        class="register-form"
        data-testid="register-form"
      >
        <!-- Basic Information -->
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          variant="outlined"
          density="comfortable"
          :rules="emailRules"
          data-testid="email-input"
          class="mb-4"
        />

        <v-text-field
          v-model="formData.username"
          label="Username"
          placeholder="johndoe"
          variant="outlined"
          density="comfortable"
          :rules="usernameRules"
          data-testid="username-input"
          class="mb-4"
        />

        <v-text-field
          v-model="formData.full_name"
          label="Full Name"
          placeholder="John Doe"
          variant="outlined"
          density="comfortable"
          :rules="fullNameRules"
          data-testid="fullname-input"
          class="mb-4"
        />

        <v-text-field
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          placeholder="••••••••"
          variant="outlined"
          density="comfortable"
          :rules="passwordRules"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          data-testid="password-input"
          class="mb-2"
        />
        <div class="password-hint mb-4">
          Min 8 chars, 1 uppercase, 1 number, 1 special char
        </div>

        <!-- Dietary Lifestyles -->
        <div class="form-section mb-4">
          <v-label class="form-label mb-2">Dietary Lifestyles</v-label>
          <div class="checkbox-group" data-testid="dietary-lifestyles">
            <v-checkbox
              v-for="lifestyle in dietaryLifestyleOptions"
              :key="lifestyle"
              v-model="formData.dietary_lifestyles"
              :value="lifestyle"
              :label="lifestyle.charAt(0).toUpperCase() + lifestyle.slice(1)"
              :data-testid="`dietary-${lifestyle}`"
              density="compact"
              hide-details
              class="checkbox-item"
            />
          </div>
        </div>

        <!-- Cuisine Preferences -->
        <div class="form-section mb-4">
          <v-label class="form-label mb-2">Cuisine Preferences</v-label>
          <div class="checkbox-group" data-testid="cuisine-preferences">
            <v-checkbox
              v-for="cuisine in cuisineOptions"
              :key="cuisine"
              v-model="formData.cuisine_preferences"
              :value="cuisine"
              :label="cuisine.charAt(0).toUpperCase() + cuisine.slice(1)"
              :data-testid="`cuisine-${cuisine}`"
              density="compact"
              hide-details
              class="checkbox-item"
            />
          </div>
        </div>

        <!-- Food Allergies -->
        <div class="form-section mb-4">
          <v-label class="form-label mb-2">Food Allergies</v-label>
          <div class="checkbox-group" data-testid="allergies">
            <v-checkbox
              v-for="allergy in allergyOptions"
              :key="allergy"
              v-model="formData.allergies"
              :value="allergy"
              :label="allergy.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')"
              :data-testid="`allergy-${allergy.replace(/\s+/g, '-')}`"
              density="compact"
              hide-details
              class="checkbox-item"
            />
          </div>
        </div>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          :loading="isLoading"
          :disabled="!isFormValid"
          block
          data-testid="register-submit"
          class="mb-4"
        >
          Sign Up
        </v-btn>

        <div class="login-link">
          Already have an account? 
          <v-btn 
            variant="text" 
            color="primary"
            @click="$router.push('/login')"
            data-testid="login-link"
            class="pa-0"
          >
            Login
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref()
const isLoading = ref(false)
const isFormValid = ref(false)
const showPassword = ref(false)

const formData = reactive({
  email: '',
  username: '',
  full_name: '',
  password: '',
  dietary_lifestyles: [] as string[],
  cuisine_preferences: [] as string[],
  allergies: [] as string[]
})

const dietaryLifestyleOptions = [
  'vegetarian',
  'vegan',
  'pescatarian',
  'paleo',
  'keto',
  'mediterranean'
]

const cuisineOptions = [
  'italian',
  'mexican',
  'chinese',
  'japanese',
  'indian',
  'mediterranean'
]

const allergyOptions = [
  'peanuts',
  'tree nuts',
  'dairy',
  'eggs',
  'fish',
  'shellfish',
  'soy',
  'gluten'
]

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email'
]

const usernameRules = [
  (v: string) => !!v || 'Username is required',
  (v: string) => v.length >= 3 || 'Username must be at least 3 characters'
]

const fullNameRules = [
  (v: string) => !!v || 'Full name is required'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
  (v: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v) || 'Password must contain at least 1 uppercase, 1 number, and 1 special character'
]

const handleSubmit = async () => {
  if (!form.value) return
  
  try {
    const { valid } = await form.value.validate()
    if (!valid) return
    
    isLoading.value = true
    
    await authStore.register({
      email: formData.email,
      username: formData.username,
      name: formData.full_name,
      password: formData.password,
      dietary_lifestyles: formData.dietary_lifestyles,
      cuisine_preferences: formData.cuisine_preferences,
      allergies: formData.allergies
    })
    
    notificationStore.success('Registration successful! Welcome to Alchemorsel!')
    router.push('/dashboard')
    
  } catch (error: unknown) {
    console.error('Registration error:', error)
    
    let errorMessage = 'Registration failed. Please try again.'
    
    if (error && typeof error === 'object') {
      if ('code' in error) {
        const errorCode = (error as { code?: string }).code
        if (errorCode === 'ERR_NETWORK' || errorCode === 'ERR_CONNECTION_REFUSED') {
          errorMessage = 'Backend server is not running. Please start the backend service.'
        }
      }
      if ('response' in error) {
        const response = (error as { response?: { data?: { error?: string; message?: string } } }).response
        if (response?.data?.error === 'user already exists') {
          errorMessage = 'An account with this email already exists. Please use a different email or try logging in.'
        } else if (response?.data?.message) {
          errorMessage = response.data.message
        } else if (response?.data?.error) {
          errorMessage = response.data.error
        }
      }
      if ('message' in error && typeof (error as { message?: string }).message === 'string') {
        errorMessage = (error as { message: string }).message
      }
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

.form-section {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.875rem;
  display: block;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.checkbox-item {
  flex: 0 0 auto;
  margin-right: 0;
}

.password-hint {
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-left: 4px;
}

.login-link {
  text-align: center;
  color: #7f8c8d;
}

/* Desktop-first responsive design */
@media (max-width: 768px) {
  .register-page {
    padding: 20px 15px;
  }
  
  .register-container {
    padding: 30px 20px;
    max-width: 100%;
  }
  
  .register-container h2 {
    font-size: 1.5rem;
  }
  
  .checkbox-group {
    flex-direction: column;
    gap: 4px;
  }
  
  .checkbox-item {
    flex: 1 1 100%;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 20px 15px;
  }
  
  .register-container h2 {
    font-size: 1.25rem;
  }
}
</style> 