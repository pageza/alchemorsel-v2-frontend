<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Email Verification</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div v-if="loading" class="text-center py-8">
              <v-progress-circular
                indeterminate
                color="primary"
                :size="60"
              ></v-progress-circular>
              <p class="mt-4">Verifying your email...</p>
            </div>

            <div v-else-if="verified" class="text-center py-8">
              <v-icon color="success" size="60">mdi-check-circle</v-icon>
              <h3 class="mt-4">Email Verified Successfully!</h3>
              <p class="mt-2">Your email has been verified. You can now access all features.</p>
            </div>

            <div v-else-if="error" class="text-center py-8">
              <v-icon color="error" size="60">mdi-alert-circle</v-icon>
              <h3 class="mt-4">Verification Failed</h3>
              <p class="mt-2">{{ errorMessage }}</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="verified || error"
              color="primary"
              @click="goToDashboard"
            >
              {{ verified ? 'Go to Dashboard' : 'Go to Login' }}
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
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const route = useRoute()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const loading = ref(true)
const verified = ref(false)
const error = ref(false)
const errorMessage = ref('')

const token = computed(() => route.query.token as string)

onMounted(async () => {
  if (!token.value) {
    error.value = true
    errorMessage.value = 'No verification token provided'
    loading.value = false
    return
  }

  try {
    const response = await AuthService.verifyEmail(token.value)
    verified.value = true
    notificationStore.success(response.message || 'Email verified successfully')
    
    // Update user's verified status if they're logged in
    if (authStore.isAuthenticated) {
      await authStore.fetchProfile()
    }
  } catch (err: any) {
    error.value = true
    errorMessage.value = err.response?.data?.error || 'Invalid or expired verification token'
  } finally {
    loading.value = false
  }
})

const goToDashboard = () => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>