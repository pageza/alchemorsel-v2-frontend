<template>
  <div class="profile-view">
    <div class="profile-container">
      <h1 class="profile-title">User Profile</h1>
      
      <div v-if="loading" class="loading">
        Loading profile...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else class="profile-content">
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-section">
            <h2>Basic Information</h2>
            
            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                v-model="profile.username"
                type="text"
                required
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                id="bio"
                v-model="profile.bio"
                class="form-textarea"
                rows="4"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="profile-picture">Profile Picture URL</label>
              <input
                id="profile-picture"
                v-model="profile.profile_picture_url"
                type="url"
                class="form-input"
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>

            <div class="form-group">
              <label for="cooking-ability">Cooking Ability Level</label>
              <select
                id="cooking-ability"
                v-model="profile.cooking_ability_level"
                class="form-select"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h2>Dietary Preferences</h2>
            <div class="preferences-grid">
              <label v-for="pref in availableDietaryPreferences" :key="pref" class="checkbox-label">
                <input
                  type="checkbox"
                  :value="pref"
                  v-model="selectedDietaryPreferences"
                  class="checkbox-input"
                />
                <span class="checkbox-text">{{ formatPreferenceName(pref) }}</span>
              </label>
            </div>
            
            <div class="form-group">
              <label for="custom-diet">Custom Dietary Preference</label>
              <input
                id="custom-diet"
                v-model="customDietaryPreference"
                type="text"
                class="form-input"
                placeholder="Enter custom dietary preference"
              />
              <button
                type="button"
                @click="addCustomDietaryPreference"
                class="btn btn-small"
                :disabled="!customDietaryPreference.trim()"
              >
                Add Custom
              </button>
            </div>
          </div>

          <div class="form-section">
            <h2>Allergens</h2>
            <div class="allergens-list">
              <div v-for="(allergen, index) in allergens" :key="index" class="allergen-item">
                <input
                  v-model="allergen.allergen_name"
                  type="text"
                  placeholder="Allergen name"
                  class="form-input allergen-input"
                />
                <select v-model="allergen.severity_level" class="form-select severity-select">
                  <option value="1">Mild</option>
                  <option value="2">Moderate</option>
                  <option value="3">Severe</option>
                  <option value="4">Very Severe</option>
                  <option value="5">Life Threatening</option>
                </select>
                <button
                  type="button"
                  @click="removeAllergen(index)"
                  class="btn btn-danger btn-small"
                >
                  Remove
                </button>
              </div>
            </div>
            <button type="button" @click="addAllergen" class="btn btn-secondary">
              Add Allergen
            </button>
          </div>

          <div class="form-section">
            <h2>Kitchen Appliances</h2>
            <div class="appliances-grid">
              <label v-for="appliance in availableAppliances" :key="appliance" class="checkbox-label">
                <input
                  type="checkbox"
                  :value="appliance"
                  v-model="selectedAppliances"
                  class="checkbox-input"
                />
                <span class="checkbox-text">{{ formatApplianceName(appliance) }}</span>
              </label>
            </div>
            
            <div class="form-group">
              <label for="custom-appliance">Custom Appliance</label>
              <input
                id="custom-appliance"
                v-model="customAppliance"
                type="text"
                class="form-input"
                placeholder="Enter custom appliance"
              />
              <button
                type="button"
                @click="addCustomAppliance"
                class="btn btn-small"
                :disabled="!customAppliance.trim()"
              >
                Add Custom
              </button>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="updating">
              {{ updating ? 'Updating...' : 'Update Profile' }}
            </button>
            <button type="button" @click="handleLogout" class="btn btn-secondary">
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { profileService } from '@/services/api';
import type { UserProfile, DietaryPreference, Allergen, UserAppliance } from '@/services/api';

const router = useRouter();
const auth = useAuthStore();

const profile = ref<UserProfile>({
  id: '',
  user_id: '',
  username: '',
  bio: '',
  profile_picture_url: '',
  privacy_level: 'private',
  cooking_ability_level: 'beginner',
  created_at: '',
  updated_at: ''
});

const dietaryPreferences = ref<DietaryPreference[]>([]);
const allergens = ref<Allergen[]>([]);
const appliances = ref<UserAppliance[]>([]);

const loading = ref(true);
const error = ref('');
const updating = ref(false);

const customDietaryPreference = ref('');
const customAppliance = ref('');

const availableDietaryPreferences = [
  'vegan', 'vegetarian', 'keto', 'paleo', 'gluten_free', 'dairy_free'
];

const availableAppliances = [
  'oven', 'microwave', 'stovetop', 'air_fryer', 'slow_cooker', 'pressure_cooker',
  'blender', 'food_processor', 'stand_mixer', 'toaster', 'grill', 'rice_cooker',
  'bread_maker', 'deep_fryer', 'steamer', 'sous_vide'
];

const selectedDietaryPreferences = computed({
  get: () => dietaryPreferences.value
    .filter(p => p.preference_type !== 'custom')
    .map(p => p.preference_type),
  set: (newPrefs: string[]) => {
    const customPrefs = dietaryPreferences.value.filter(p => p.preference_type === 'custom');
    const standardPrefs = newPrefs.map(type => ({ preference_type: type }));
    dietaryPreferences.value = [...standardPrefs, ...customPrefs];
  }
});

const selectedAppliances = computed({
  get: () => appliances.value
    .filter(a => a.appliance_type !== 'custom')
    .map(a => a.appliance_type),
  set: (newAppliances: string[]) => {
    const customAppliances = appliances.value.filter(a => a.appliance_type === 'custom');
    const standardAppliances = newAppliances.map(type => ({ appliance_type: type }));
    appliances.value = [...standardAppliances, ...customAppliances];
  }
});

const formatPreferenceName = (pref: string) => {
  return pref.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatApplianceName = (appliance: string) => {
  return appliance.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const addCustomDietaryPreference = () => {
  if (customDietaryPreference.value.trim()) {
    dietaryPreferences.value.push({
      preference_type: 'custom',
      custom_name: customDietaryPreference.value.trim()
    });
    customDietaryPreference.value = '';
  }
};

const addCustomAppliance = () => {
  if (customAppliance.value.trim()) {
    appliances.value.push({
      appliance_type: 'custom',
      custom_name: customAppliance.value.trim()
    });
    customAppliance.value = '';
  }
};

const addAllergen = () => {
  allergens.value.push({
    allergen_name: '',
    severity_level: 1
  });
};

const removeAllergen = (index: number) => {
  allergens.value.splice(index, 1);
};

const loadProfile = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const [profileData, dietaryData, allergenData, applianceData] = await Promise.all([
      profileService.getProfile(),
      profileService.getDietaryPreferences(),
      profileService.getAllergens(),
      profileService.getAppliances()
    ]);
    
    profile.value = profileData;
    dietaryPreferences.value = dietaryData;
    allergens.value = allergenData;
    appliances.value = applianceData;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load profile';
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  try {
    updating.value = true;
    error.value = '';
    
    await Promise.all([
      profileService.updateProfile({
        username: profile.value.username,
        bio: profile.value.bio,
        profile_picture_url: profile.value.profile_picture_url,
        cooking_ability_level: profile.value.cooking_ability_level
      }),
      profileService.updateDietaryPreferences(dietaryPreferences.value),
      profileService.updateAllergens(allergens.value.filter(a => a.allergen_name.trim())),
      profileService.updateAppliances(appliances.value)
    ]);
    
    alert('Profile updated successfully!');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update profile';
  } finally {
    updating.value = false;
  }
};

const handleLogout = async () => {
  try {
    await profileService.logout();
    auth.logout();
    router.push('/login');
  } catch (err) {
    console.error('Logout error:', err);
    auth.logout();
    router.push('/login');
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<style lang="scss" scoped>
.profile-view {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.profile-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
  background-color: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  
  h2 {
    color: #374151;
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    border-bottom: 2px solid #42b983;
    padding-bottom: 0.5rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-input, .form-textarea, .form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.preferences-grid, .appliances-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafb;
  }
}

.checkbox-input {
  margin: 0;
}

.checkbox-text {
  font-size: 0.9rem;
  color: #374151;
}

.allergens-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.allergen-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  
  .allergen-input {
    flex: 2;
  }
  
  .severity-select {
    flex: 1;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #369870;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .profile-view {
    padding: 1rem;
  }
  
  .profile-container {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .preferences-grid, .appliances-grid {
    grid-template-columns: 1fr;
  }
  
  .allergen-item {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>      