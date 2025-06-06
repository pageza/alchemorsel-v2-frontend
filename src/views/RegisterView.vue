<template>
  <div class="register">
    <div class="register__container">
      <h1>Create Account</h1>
      <form class="register__form" @submit.prevent="handleSubmit">
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            :disabled="loading"
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label>Dietary Preferences</label>
          <div class="checkbox-group">
            <label v-for="pref in dietaryPreferences" :key="pref.id" class="checkbox-label">
              <input
                type="checkbox"
                :value="pref.id"
                v-model="selectedDietaryPreferences"
                :disabled="loading"
              />
              {{ pref.label }}
            </label>
          </div>
          <p class="form-hint">Select any dietary preferences that apply to you</p>
        </div>
        <div class="form-group">
          <label>Allergies</label>
          <div class="checkbox-group">
            <label v-for="allergy in commonAllergies" :key="allergy" class="checkbox-label">
              <input
                type="checkbox"
                :value="allergy"
                v-model="selectedAllergies"
                :disabled="loading"
              />
              {{ allergy }}
            </label>
          </div>
          <p class="form-hint warning">
            Note: If you have any allergies, please select them above. While we try to accommodate dietary restrictions, 
            you are responsible for verifying the safety of any recipes for your specific needs.
          </p>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>
      <p class="register__login">
        Already have an account?
        <router-link to="/login">Sign in here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const auth = useAuthStore();

const dietaryPreferences = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'gluten_free', label: 'Gluten Free' },
  { id: 'dairy_free', label: 'Dairy Free' }
];

const commonAllergies = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Soy',
  'Wheat',
  'Fish',
  'Shellfish'
];

const selectedDietaryPreferences = ref<string[]>([]);
const selectedAllergies = ref<string[]>([]);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = "";
    
    await auth.register({
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value,
      dietary_preferences: selectedDietaryPreferences.value,
      allergies: selectedAllergies.value
    });
    router.push("/recipes");
  } catch (err: any) {
    error.value = err.message || "Failed to create account. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--background-color);

  &__container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  h1 {
    text-align: center;
    color: var(--primary-color);
    margin-bottom: 2rem;
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

    input {
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

  &__login {
    text-align: center;
    margin-top: 1.5rem;
    color: var(--text-color);

    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
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
  }

  .checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }
  }

  .form-hint {
    font-size: 0.875rem;
    color: var(--text-color);
    margin-top: 0.5rem;

    &.warning {
      color: #856404;
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
      padding: 0.75rem;
      border-radius: 4px;
      margin-top: 0.75rem;
    }
  }
}
</style>   