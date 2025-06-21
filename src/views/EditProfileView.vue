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
                    :image="profile.profile_picture_url || undefined"
                    size="100"
                    class="mr-4"
                  >
                    <v-icon v-if="!profile.profile_picture_url" size="50">mdi-account</v-icon>
                  </v-avatar>
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
                  <v-col cols="12">
                    <v-text-field
                      v-model="profile.username"
                      label="Username"
                      :rules="[v => !!v || 'Username is required']"
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
                      readonly
                      hint="Email cannot be changed"
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

            <!-- Dietary Lifestyles -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Dietary Lifestyles
              </v-card-title>
              <v-card-text>
                <v-select
                  v-model="selectedDietaryLifestyles"
                  :items="dietaryLifestyleTypes"
                  label="Dietary Lifestyles"
                  multiple
                  chips
                  hint="Select your dietary lifestyle choices (e.g., vegetarian, keto, paleo)"
                ></v-select>
              </v-card-text>
            </v-card>

            <!-- Cuisine Preferences -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Cuisine Preferences
              </v-card-title>
              <v-card-text>
                <v-select
                  v-model="selectedCuisinePrefs"
                  :items="cuisineTypes"
                  label="Favorite Cuisines"
                  multiple
                  chips
                  hint="Select your favorite types of cuisine for recipe recommendations"
                ></v-select>
              </v-card-text>
            </v-card>

            <!-- Food Allergies -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Food Allergies
              </v-card-title>
              <v-card-text>
                <v-select
                  v-model="selectedAllergens"
                  :items="allergenTypes"
                  label="Allergens to Avoid"
                  multiple
                  chips
                  hint="Select specific food allergens you need to avoid"
                ></v-select>
              </v-card-text>
            </v-card>

            <!-- Privacy Settings -->
            <v-card class="mb-6">
              <v-card-title class="text-h5 font-weight-bold">
                Privacy Settings
              </v-card-title>
              <v-card-text>
                <v-select
                  v-model="profile.privacy_level"
                  :items="privacyLevels"
                  label="Profile Privacy"
                  hint="Control who can see your profile information"
                ></v-select>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import { UserService } from '@/services/user.service'
import type { User } from '@/types/auth.types'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref<HTMLFormElement | null>(null)
const isFormValid = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(true)
const avatarFile = ref<File[]>([])

// Profile data
const profile = ref<User>({
  id: '',
  email: '',
  username: '',
  name: '',
  role: 'user',
  profile_picture_url: '',
  bio: '',
  privacy_level: 'public',
  dietary_lifestyles: [],
  cuisine_preferences: [],
  allergens: [],
  email_verified: false,
  created_at: '',
  updated_at: ''
})

// Form selections
const selectedDietaryLifestyles = ref<string[]>([])
const selectedCuisinePrefs = ref<string[]>([])
const selectedAllergens = ref<string[]>([])

// Options (must match database enum values)
const dietaryLifestyleTypes = [
  'vegetarian',
  'vegan',
  'pescatarian',
  'paleo',
  'keto',
  'mediterranean',
  'whole30',
  'raw',
  'low_carb',
  'low_fat',
  'high_protein',
  'custom'
]

const cuisineTypes = [
  'mediterranean',
  'mexican',
  'italian',
  'chinese',
  'japanese',
  'indian',
  'thai',
  'french',
  'greek',
  'korean',
  'middle_eastern',
  'american',
  'british',
  'spanish',
  'german',
  'custom'
]

const allergenTypes = [
  'peanuts',
  'tree nuts',
  'dairy',
  'eggs',
  'fish',
  'shellfish',
  'soy',
  'gluten',
  'sesame',
  'mustard',
  'celery',
  'lupin',
  'sulphites'
]

const privacyLevels = [
  { title: 'Public', value: 'public' },
  { title: 'Friends Only', value: 'friends' },
  { title: 'Private', value: 'private' }
]

// Load profile data on mount
onMounted(async () => {
  try {
    isLoading.value = true
    const userProfile = await UserService.getProfile()
    
    profile.value = userProfile
    selectedDietaryLifestyles.value = userProfile.dietary_lifestyles || []
    selectedCuisinePrefs.value = userProfile.cuisine_preferences || []
    selectedAllergens.value = userProfile.allergens?.map(a => a.allergen_name) || []
    
  } catch (error) {
    console.error('Failed to load profile:', error)
    notificationStore.error('Failed to load profile data')
  } finally {
    isLoading.value = false
  }
})

// Handle avatar upload
const handleAvatarUpload = (files: File[]) => {
  if (files && files.length > 0) {
    // TODO: Implement actual image upload to backend
    // For now, create a local URL for preview
    profile.value.profile_picture_url = URL.createObjectURL(files[0])
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  try {
    const updateData = {
      username: profile.value.username,
      bio: profile.value.bio || '',
      privacy_level: profile.value.privacy_level || 'public',
      preferences: {
        dietary_lifestyles: selectedDietaryLifestyles.value,
        cuisine_preferences: selectedCuisinePrefs.value,
        allergies: selectedAllergens.value
      }
    }

    await UserService.updateProfile(updateData)
    
    // Update auth store with new user data
    await authStore.fetchProfile()
    
    notificationStore.success('Profile updated successfully!')
    router.push('/profile')
    
  } catch (error) {
    console.error('Error updating profile:', error)
    notificationStore.error('Failed to update profile. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>