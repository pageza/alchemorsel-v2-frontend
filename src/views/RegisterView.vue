<template>
  <div class="register-bg">
    <div class="register-header">Create an account</div>
    <div class="register-card">
      <form @submit.prevent="onRegister">
        <v-text-field v-model="fullName" label="Full Name" class="register-input" variant="outlined" hide-details />
        <v-text-field v-model="email" label="Email Address" class="register-input" variant="outlined" hide-details />
        <v-text-field v-model="password" label="Password" class="register-input" variant="outlined" type="password" hide-details />
        <v-text-field v-model="confirmPassword" label="Confirm Password" class="register-input" variant="outlined" type="password" hide-details />
        <v-text-field v-model="username" label="Username" class="register-input" variant="outlined" hide-details />
        <v-combobox
          v-model="allergies"
          :items="allergyOptions"
          label="Food Allergies"
          class="register-input"
          multiple
          chips
          clearable
          hide-details
          variant="outlined"
        />
        <v-combobox
          v-model="dietPrefs"
          :items="dietOptions"
          label="Diet/Cuisine Preferences"
          class="register-input"
          multiple
          chips
          clearable
          hide-details
          variant="outlined"
        />
        <v-btn class="register-btn" type="submit">Register</v-btn>
      </form>
      <div v-if="error" class="register-error">{{ error }}</div>
      <div class="register-login-link">
        Already have an account? <router-link to="/login">Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const username = ref('')
const allergies = ref<string[]>([])
const dietPrefs = ref<string[]>([])
const error = ref('')

const allergyOptions = [
  'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Shellfish', 'Fish', 'Soy', 'Wheat', 'Gluten', 'Sesame'
]
const dietOptions = [
  'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Halal', 'Kosher', 'Italian', 'Mexican', 'Indian', 'Japanese', 'Chinese', 'Mediterranean'
]

async function onRegister() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  try {
    await authStore.register({
      name: fullName.value,
      email: email.value,
      password: password.value,
      username: username.value,
      dietary_preferences: dietPrefs.value,
      allergies: allergies.value
    })
    // Auto-login after successful registration
    await authStore.login({ email: email.value, password: password.value })
    router.push('/recipes')
  } catch (e) {
    error.value = authStore.error || 'Registration failed.'
  }
}
</script>

<style scoped>
.register-bg {
  background: #2d221a;
  min-height: 100vh;
  width: 100vw;
  padding: 48px 0 0 0;
}
.register-header {
  font-family: 'Merriweather', serif;
  font-size: 2.6rem;
  color: #f5e6c8;
  text-align: center;
  margin-bottom: 38px;
  margin-top: 32px;
}
.register-card {
  background: #3a2a1a;
  border-radius: 22px;
  box-shadow: 0 2px 18px rgba(0,0,0,0.18);
  padding: 48px 38px 38px 38px;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.register-input :deep(.v-field) {
  background: #2d221a;
  color: #f5e6c8;
  border-radius: 10px;
}
.register-input :deep(.v-label) {
  color: #e0c9a6 !important;
}
.register-input :deep(.v-input__control) {
  color: #f5e6c8;
}
.register-btn {
  background: #d2691e;
  color: #fff;
  font-weight: 700;
  font-size: 1.18rem;
  border-radius: 10px;
  box-shadow: none;
  margin-top: 18px;
  padding: 0 0;
  height: 54px;
  width: 100%;
}
.register-error {
  color: #ff6b6b;
  font-size: 1.1rem;
  margin-bottom: 8px;
  text-align: center;
}
.register-login-link {
  margin-top: 16px;
  text-align: center;
  color: #e0c9a6;
}
.register-login-link a {
  color: #a86c3a;
  text-decoration: none;
  font-weight: bold;
}
</style> 