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
        <div class="password-hint mb-4">Min 8 chars, 1 uppercase, 1 number, 1 special char</div>

        <!-- Primary Dietary Preference -->
        <v-select
          v-model="formData.primary_dietary_preference"
          label="Primary Dietary Preference"
          :items="dietaryPreferenceOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          data-testid="primary-dietary-preference"
          class="mb-4"
          clearable
        />

        <!-- Additional Dietary Preferences (Optional) -->
        <v-select
          v-model="formData.additional_dietary_preferences"
          label="Additional Dietary Preferences (Optional)"
          :items="dietaryPreferenceOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          multiple
          chips
          data-testid="additional-dietary-preferences"
          class="mb-4"
          clearable
        />

        <!-- Favorite Cuisine -->
        <v-select
          v-model="formData.favorite_cuisine"
          label="Favorite Cuisine (Optional)"
          :items="cuisineOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          data-testid="favorite-cuisine"
          class="mb-4"
          clearable
        />

        <!-- Food Allergies -->
        <v-select
          v-model="formData.allergies"
          label="Food Allergies (Optional)"
          :items="allergyOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          multiple
          chips
          data-testid="allergies"
          class="mb-4"
          clearable
        />

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
  primary_dietary_preference: '',
  additional_dietary_preferences: [] as string[],
  favorite_cuisine: '',
  allergies: [] as string[],
})

// Match backend enum values exactly
const dietaryPreferenceOptions = [
  { label: 'Omnivore', value: 'omnivore' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Pescatarian', value: 'pescatarian' },
  { label: 'Flexitarian', value: 'flexitarian' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
  { label: 'Low Carb', value: 'low-carb' },
  { label: 'Low Fat', value: 'low-fat' },
  { label: 'Mediterranean', value: 'mediterranean' },
  { label: 'Whole30', value: 'whole30' },
  { label: 'Carnivore', value: 'carnivore' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Dairy-Free', value: 'dairy-free' },
  { label: 'Nut-Free', value: 'nut-free' },
  { label: 'Soy-Free', value: 'soy-free' },
  { label: 'Egg-Free', value: 'egg-free' },
  { label: 'Shellfish-Free', value: 'shellfish-free' },
  { label: 'Custom', value: 'custom' },
]

const cuisineOptions = [
  { label: 'Mediterranean', value: 'mediterranean' },
  { label: 'Mexican', value: 'mexican' },
  { label: 'Italian', value: 'italian' },
  { label: 'Chinese', value: 'chinese' },
  { label: 'Japanese', value: 'japanese' },
  { label: 'Indian', value: 'indian' },
  { label: 'Thai', value: 'thai' },
  { label: 'French', value: 'french' },
  { label: 'Greek', value: 'greek' },
  { label: 'Korean', value: 'korean' },
  { label: 'Middle Eastern', value: 'middle_eastern' },
  { label: 'American', value: 'american' },
  { label: 'British', value: 'british' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'German', value: 'german' },
]

const allergyOptions = [
  { label: 'Peanuts', value: 'peanuts' },
  { label: 'Tree Nuts', value: 'tree nuts' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Eggs', value: 'eggs' },
  { label: 'Fish', value: 'fish' },
  { label: 'Shellfish', value: 'shellfish' },
  { label: 'Soy', value: 'soy' },
  { label: 'Gluten', value: 'gluten' },
  { label: 'Sesame', value: 'sesame' },
  { label: 'Mustard', value: 'mustard' },
  { label: 'Celery', value: 'celery' },
  { label: 'Lupin', value: 'lupin' },
  { label: 'Sulphites', value: 'sulphites' },
]

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email',
]

const usernameRules = [
  (v: string) => !!v || 'Username is required',
  (v: string) => v.length >= 3 || 'Username must be at least 3 characters',
]

const fullNameRules = [(v: string) => !!v || 'Full name is required']

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
  (v: string) =>
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v) ||
    'Password must contain at least 1 uppercase, 1 number, and 1 special character',
]

const handleSubmit = async () => {
  if (!form.value) return

  try {
    const { valid } = await form.value.validate()
    if (!valid) return

    isLoading.value = true

    // Build dietary preferences array
    const dietaryPreferences = []
    if (formData.primary_dietary_preference) {
      dietaryPreferences.push(formData.primary_dietary_preference)
    }
    dietaryPreferences.push(...formData.additional_dietary_preferences)

    // Build cuisine preferences array
    const cuisinePreferences = formData.favorite_cuisine ? [formData.favorite_cuisine] : []

    await authStore.register({
      email: formData.email,
      username: formData.username,
      name: formData.full_name,
      password: formData.password,
      dietary_lifestyles: dietaryPreferences,
      cuisine_preferences: cuisinePreferences,
      allergies: formData.allergies,
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
        const response = (error as { response?: { data?: { error?: string; message?: string } } })
          .response
        if (response?.data?.error === 'user already exists') {
          errorMessage =
            'An account with this email already exists. Please use a different email or try logging in.'
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
