<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Reset Password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-alert
                v-if="errorMessage"
                type="error"
                dismissible
                @click:close="errorMessage = ''"
                class="mb-4"
              >
                {{ errorMessage }}
              </v-alert>

              <div v-if="!tokenValidated">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  class="ma-4"
                ></v-progress-circular>
                <p>Validating reset token...</p>
              </div>

              <div v-else-if="tokenValid">
                <p class="mb-4">
                  Enter your new password below.
                </p>

                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="New Password"
                  type="password"
                  prepend-icon="mdi-lock"
                  required
                  :disabled="loading"
                ></v-text-field>

                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  label="Confirm Password"
                  type="password"
                  prepend-icon="mdi-lock-check"
                  required
                  :disabled="loading"
                ></v-text-field>
              </div>
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
              v-if="tokenValid"
              color="primary"
              @click="resetPassword"
              :disabled="!valid || loading"
              :loading="loading"
            >
              Reset Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AuthService } from '@/services/auth.service'
import { useNotificationStore } from '@/stores/notification.store'

const router = useRouter()
const route = useRoute()
const notificationStore = useNotificationStore()

const valid = ref(false)
const loading = ref(false)
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const tokenValidated = ref(false)
const tokenValid = ref(false)

const token = computed(() => route.query.token as string)

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => v === password.value || 'Passwords must match',
]

onMounted(async () => {
  if (!token.value) {
    errorMessage.value = 'No reset token provided'
    tokenValidated.value = true
    return
  }

  try {
    await AuthService.verifyResetToken(token.value)
    tokenValid.value = true
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Invalid or expired reset token'
    tokenValid.value = false
  } finally {
    tokenValidated.value = true
  }
})

const resetPassword = async () => {
  if (!valid.value || !token.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await AuthService.completePasswordReset(token.value, password.value)
    notificationStore.success(response.message || 'Password has been reset successfully')
    router.push('/login')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Failed to reset password. Please try again.'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>