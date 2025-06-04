<template>
  <div class="profile">
    <div class="profile__container">
      <h1>Profile</h1>
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-if="loading" class="profile__loading">
        <div class="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
      <div v-else class="profile__content">
        <div class="profile__info">
          <h2>User Information</h2>
          <form @submit.prevent="updateProfile" class="profile__form">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                v-model="profile.username"
                required
                :disabled="updating"
              />
            </div>
            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                id="bio"
                v-model="profile.bio"
                :disabled="updating"
                rows="3"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            <div class="form-group">
              <label for="profile_picture_url">Profile Picture URL</label>
              <input
                type="url"
                id="profile_picture_url"
                v-model="profile.profile_picture_url"
                :disabled="updating"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="updating">
              {{ updating ? 'Updating...' : 'Update Profile' }}
            </button>
          </form>
        </div>
        <div class="profile__preferences">
          <h2>Account Actions</h2>
          <button @click="handleLogout" class="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { profileService } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  bio: string;
  profile_picture_url: string;
  privacy_level: string;
  created_at: string;
  updated_at: string;
}

const router = useRouter();
const auth = useAuthStore();
const profile = ref<UserProfile>({
  id: '',
  user_id: '',
  username: '',
  bio: '',
  profile_picture_url: '',
  privacy_level: 'public',
  created_at: '',
  updated_at: ''
});
const loading = ref(false);
const updating = ref(false);
const error = ref('');

const fetchProfile = async () => {
  try {
    loading.value = true;
    error.value = '';
    const data = await profileService.getProfile();
    profile.value = data;
  } catch (err: any) {
    console.error('Error fetching profile:', err);
    error.value = err.message || 'Failed to load profile. Please try again.';
    
    if (err.message?.includes('401') || err.message?.includes('authentication')) {
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  try {
    updating.value = true;
    error.value = '';
    
    await profileService.updateProfile({
      username: profile.value.username,
      bio: profile.value.bio,
      profile_picture_url: profile.value.profile_picture_url
    });
    
    error.value = '';
  } catch (err: any) {
    console.error('Error updating profile:', err);
    error.value = err.message || 'Failed to update profile. Please try again.';
  } finally {
    updating.value = false;
  }
};

const handleLogout = () => {
  auth.logout();
};

onMounted(() => {
  fetchProfile();
});
</script>

<style lang="scss" scoped>
.profile {
  padding: 2rem;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    color: var(--primary-color);
    margin-bottom: 2rem;
  }

  &__loading {
    text-align: center;
    padding: 4rem 2rem;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  &__info,
  &__preferences {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h2 {
      color: var(--secondary-color);
      margin-bottom: 1rem;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 500;
      color: var(--text-color);
    }

    input,
    textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }
    }
  }

  .alert {
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;

    &-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &-primary {
      background-color: var(--primary-color);
      color: white;

      &:hover:not(:disabled) {
        background-color: var(--primary-color-dark);
      }
    }

    &-danger {
      background-color: #dc3545;
      color: white;

      &:hover:not(:disabled) {
        background-color: #c82333;
      }
    }
  }
}
</style>   