<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Forgot Password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-alert
                v-if="successMessage"
                type="success"
                dismissible
                @click:close="successMessage = ''"
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>
              
              <v-alert
                v-if="errorMessage"
                type="error"
                dismissible
                @click:close="errorMessage = ''"
                class="mb-4"
              >
                {{ errorMessage }}
              </v-alert>

              <p class="mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
                required
                :disabled="loading"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              variant="text"
              @click="goToLogin"
              :disabled="loading"
            >
              Back to Login
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="submitRequest"
              :disabled="!valid || loading"
              :loading="loading"
            >
              Send Reset Link
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'

const router = useRouter()

const valid = ref(false)
const loading = ref(false)
const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const submitRequest = async () => {
  if (!valid.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await AuthService.requestPasswordReset(email.value)
    successMessage.value = response.message || 'If the email exists, a password reset link has been sent'
    email.value = ''
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Failed to process request. Please try again.'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>