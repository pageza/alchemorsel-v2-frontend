<template>
  <div class="login-bg">
    <div class="login-header">Sign In</div>
    <div class="login-card">
      <form @submit.prevent="onLogin">
        <v-text-field v-model="email" label="Email Address" class="login-input" variant="outlined" hide-details />
        <v-text-field v-model="password" label="Password" class="login-input" variant="outlined" type="password" hide-details />
        <v-btn class="login-btn" type="submit">Sign In</v-btn>
      </form>
      <div v-if="error" class="login-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function onLogin() {
  error.value = ''
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/recipes')
  } catch (e) {
    error.value = authStore.error || 'Login failed.'
  }
}
</script>

<style scoped>
.login-bg {
  background: #2d221a;
  min-height: 100vh;
  width: 100vw;
  padding: 48px 0 0 0;
}
.login-header {
  font-family: 'Merriweather', serif;
  font-size: 2.6rem;
  color: #f5e6c8;
  text-align: center;
  margin-bottom: 38px;
  margin-top: 32px;
}
.login-card {
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
.login-input :deep(.v-field) {
  background: #2d221a;
  color: #f5e6c8;
  border-radius: 10px;
}
.login-input :deep(.v-label) {
  color: #e0c9a6 !important;
}
.login-input :deep(.v-input__control) {
  color: #f5e6c8;
}
.login-btn {
  background: #a86c3a;
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
.login-error {
  color: #ff6b6b;
  font-size: 1.1rem;
  margin-top: 12px;
  text-align: center;
}
</style> 