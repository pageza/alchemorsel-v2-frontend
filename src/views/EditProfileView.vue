<template>
  <div>
    <v-container class="py-8">
      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <div class="d-flex align-center mb-4">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              class="mr-4"
              @click="$router.back()"
            ></v-btn>
            <h1 class="text-h4 font-weight-bold">Edit Profile</h1>
          </div>

          <v-form
            ref="form"
            v-model="isFormValid"
            @submit.prevent="handleSubmit"
          >
            <!-- Profile Picture -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Profile Picture
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar
                    :image="profile.avatar"
                    size="100"
                    class="mr-4"
                  ></v-avatar>
                  <v-file-input
                    v-model="avatarFile"
                    accept="image/*"
                    label="Change Profile Picture"
                    prepend-icon="mdi-camera"
                    @change="handleAvatarUpload"
                  ></v-file-input>
                </div>
              </v-card-text>
            </v-card>

            <!-- Basic Information -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Basic Information
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profile.firstName"
                      label="First Name"
                      :rules="[v => !!v || 'First name is required']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profile.lastName"
                      label="Last Name"
                      :rules="[v => !!v || 'Last name is required']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="profile.email"
                      label="Email"
                      type="email"
                      :rules="[
                        v => !!v || 'Email is required',
                        v => /.+@.+\..+/.test(v) || 'Email must be valid'
                      ]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="profile.bio"
                      label="Bio"
                      rows="3"
                      hint="Tell us about yourself"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Preferences -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Preferences
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="profile.cuisinePreferences"
                      :items="cuisineTypes"
                      label="Preferred Cuisines"
                      multiple
                      chips
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="profile.dietaryRestrictions"
                      :items="dietaryTypes"
                      label="Dietary Restrictions"
                      multiple
                      chips
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="profile.emailNotifications"
                      label="Email Notifications"
                      color="primary"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Password Change -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Change Password
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password.current"
                      label="Current Password"
                      type="password"
                      :rules="[v => !v || v.length >= 8 || 'Password must be at least 8 characters']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="password.new"
                      label="New Password"
                      type="password"
                      :rules="[v => !v || v.length >= 8 || 'Password must be at least 8 characters']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="password.confirm"
                      label="Confirm New Password"
                      type="password"
                      :rules="[
                        v => !v || v === password.new || 'Passwords must match'
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Submit Button -->
            <div class="d-flex justify-end">
              <v-btn
                type="submit"
                color="primary"
                size="large"
                :loading="isSubmitting"
                :disabled="!isFormValid"
              >
                Save Changes
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref<HTMLFormElement | null>(null)
const isFormValid = ref(false)
const isSubmitting = ref(false)
const avatarFile = ref(null)

// Mock data - replace with actual data from your backend
const cuisineTypes = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'American'
]

const dietaryTypes = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Kosher',
  'Halal',
  'Keto',
  'Paleo'
]

// Initialize profile data
const profile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  bio: 'Food enthusiast and amateur chef',
  avatar: 'https://picsum.photos/200/200?random=1',
  cuisinePreferences: ['Italian', 'Mediterranean'],
  dietaryRestrictions: ['Vegetarian'],
  emailNotifications: true
})

const password = ref({
  current: '',
  new: '',
  confirm: ''
})

// Handle avatar upload
const handleAvatarUpload = (file: File) => {
  if (file) {
    // TODO: Implement actual image upload to your backend
    // For now, we'll just create a local URL
    profile.value.avatar = URL.createObjectURL(file)
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  try {
    // TODO: Implement actual API call to your backend
    console.log('Updating profile:', profile.value)
    if (password.value.new) {
      console.log('Updating password')
    }
    
    // Navigate back to profile page on success
    router.push('/profile')
  } catch (error) {
    console.error('Error updating profile:', error)
    // TODO: Show error message to user
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style> 