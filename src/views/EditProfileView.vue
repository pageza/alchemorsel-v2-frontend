<template>
  <div class="edit-profile-bg">
    <div class="edit-profile-container">
      <div class="edit-profile-title">Edit Profile</div>
      <div class="edit-profile-avatar">
        <v-icon size="100">mdi-account-circle</v-icon>
      </div>
      <v-form class="edit-profile-form">
        <v-text-field
          v-model="username"
          label="Username"
          variant="outlined"
          class="edit-profile-input"
          hide-details
        />
        <v-text-field
          v-model="email"
          label="Email address"
          variant="outlined"
          class="edit-profile-input"
          hide-details
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          class="edit-profile-input"
          hide-details
        />
        <v-textarea
          v-model="bio"
          label="Bio"
          variant="outlined"
          class="edit-profile-input edit-profile-bio"
          hide-details
        />
        <div class="edit-profile-actions">
          <v-btn class="save-btn" color="accent" @click="onSave" block>Save Changes</v-btn>
          <v-btn class="cancel-btn" variant="outlined" @click="onCancel" block>Cancel</v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('johndoe')
const email = ref('johndoe@example.com')
const password = ref('')
const bio = ref('Passionate home cook and food lover')

function onCancel() {
  router.push('/profile')
}
function onSave() {
  // TODO: Implement save logic
}
</script>

<style scoped>
.edit-profile-bg {
  background: #232325;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 60px;
}
.edit-profile-container {
  background: #3a2a1a;
  border-radius: 24px;
  box-shadow: 0 2px 18px rgba(0,0,0,0.13);
  padding: 48px 56px 40px 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 520px;
  max-width: 520px;
}
.edit-profile-title {
  font-family: 'Merriweather', serif;
  font-size: 2.8rem;
  color: #f5e6c8;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
}
.edit-profile-avatar {
  background: #6b4a2a;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
}
.edit-profile-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.edit-profile-input {
  background: #2d2116 !important;
  color: #f5e6c8 !important;
  border-radius: 8px;
}
.edit-profile-input input,
.edit-profile-input textarea {
  color: #f5e6c8 !important;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;
}
.edit-profile-input .v-label {
  color: #e0c9a6 !important;
  font-size: 1.08rem;
  font-family: 'Inter', sans-serif;
}
.edit-profile-bio textarea {
  min-height: 70px;
}
.edit-profile-actions {
  display: flex;
  flex-direction: row;
  gap: 24px;
  margin-top: 18px;
  justify-content: center;
}
.save-btn {
  background: #b86a3c !important;
  color: #f5e6c8 !important;
  font-size: 1.18rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 8px;
  min-width: 180px;
  text-transform: none;
}
.cancel-btn {
  color: #f5e6c8 !important;
  border: 1.5px solid #e0c9a6 !important;
  background: none !important;
  font-size: 1.18rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 8px;
  min-width: 180px;
  text-transform: none;
}
.cancel-btn:hover, .cancel-btn:focus {
  background: #4a3622 !important;
}
</style> 