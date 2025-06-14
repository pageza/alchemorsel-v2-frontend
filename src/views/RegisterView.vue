<template>
  <div class="register-container">
    <v-card class="register-card" max-width="500">
      <v-card-title class="text-h4 font-weight-bold text-center pt-6">
        Create Account
      </v-card-title>
      <v-card-subtitle class="text-center pb-4">
        Join Alchemorsel to start sharing your recipes
      </v-card-subtitle>

      <v-card-text>
        <v-form
          ref="form"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
        >
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="firstName"
                label="First Name"
                :rules="[v => !!v || 'First name is required']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lastName"
                label="Last Name"
                :rules="[v => !!v || 'Last name is required']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            :rules="[
              v => !!v || 'Email is required',
              v => /.+@.+\..+/.test(v) || 'Email must be valid'
            ]"
            required
            variant="outlined"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              v => !!v || 'Password is required',
              v => v.length >= 8 || 'Password must be at least 8 characters'
            ]"
            required
            variant="outlined"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              v => !!v || 'Please confirm your password',
              v => v === password || 'Passwords must match'
            ]"
            required
            variant="outlined"
            class="mb-4"
          ></v-text-field>

          <v-checkbox
            v-model="acceptTerms"
            :rules="[v => !!v || 'You must accept the terms to continue']"
            label="I agree to the Terms of Service and Privacy Policy"
            required
            class="mb-4"
          ></v-checkbox>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="isLoading"
            :disabled="!isFormValid"
            class="mb-4"
          >
            Create Account
          </v-btn>

          <v-divider class="mb-4">
            <span class="text-caption text-medium-emphasis px-4">or sign up with</span>
          </v-divider>

          <div class="d-flex justify-space-between mb-6">
            <v-btn
              variant="outlined"
              block
              class="me-2"
              @click="handleSocialSignup('google')"
            >
              <v-icon start icon="mdi-google"></v-icon>
              Google
            </v-btn>
            <v-btn
              variant="outlined"
              block
              class="ms-2"
              @click="handleSocialSignup('github')"
            >
              <v-icon start icon="mdi-github"></v-icon>
              GitHub
            </v-btn>
          </div>

          <div class="text-center">
            <span class="text-body-2 text-medium-emphasis">Already have an account?</span>
            <v-btn
              variant="text"
              color="primary"
              class="text-none ms-2"
              @click="$router.push('/auth/login')"
            >
              Sign In
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const form = ref()
const isFormValid = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const { register } = useAuth()
const { success, error: errorNotification } = useNotification()

const handleSubmit = async () => {
  if (!form.value?.validate()) return
  isLoading.value = true
  try {
    await register({
      name: `${firstName.value} ${lastName.value}`,
      email: email.value,
      password: password.value,
      username: email.value,
      dietary_preferences: [],
      allergies: [],
    })
    success('Registration successful')
    router.push('/recipes')
  } catch (err) {
    errorNotification((err as Error).message || 'Failed to register')
  } finally {
    isLoading.value = false
  }
}

const handleSocialSignup = (provider: string) => {
  // TODO: Implement social signup
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.register-card {
  width: 100%;
  border-radius: 12px;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.12;
}
</style> 