<template>
  <v-alert
    v-if="showBanner"
    type="warning"
    closable
    @click:close="dismissBanner"
    class="email-verification-banner"
  >
    <div class="d-flex align-center justify-space-between">
      <div>
        <strong>Verify your email address</strong>
        <p class="mb-0">Please check your email and click the verification link to access all features.</p>
      </div>
      <v-btn
        color="primary"
        variant="outlined"
        size="small"
        @click="resendEmail"
        :loading="loading"
      >
        Resend Email
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { AuthService } from '@/services/auth.service'
import { useNotificationStore } from '@/stores/notification.store'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const dismissed = ref(false)

const showBanner = computed(() => {
  return authStore.isAuthenticated && 
         authStore.user && 
         !authStore.user.email_verified && 
         !dismissed.value
})

const dismissBanner = () => {
  dismissed.value = true
}

const resendEmail = async () => {
  if (!authStore.user?.email) return
  
  loading.value = true
  try {
    const response = await AuthService.resendVerificationEmail(authStore.user.email)
    notificationStore.success(response.message || 'Verification email sent')
  } catch (error: any) {
    notificationStore.error(error.response?.data?.error || 'Failed to send verification email')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.email-verification-banner {
  margin-bottom: 16px;
}
</style>