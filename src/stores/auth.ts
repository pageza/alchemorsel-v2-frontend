import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService, profileService, updateAuthToken } from '@/services/api';
import type { RegisterData } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!localStorage.getItem('token'));
  const token = ref(localStorage.getItem('token') || '');

  async function login(credentials: { email: string; password: string }) {
    const response = await authService.login(credentials);
    token.value = response.token;
    updateAuthToken(response.token);
    isAuthenticated.value = true;
    return response;
  }

  async function register(data: RegisterData) {
    const response = await authService.register(data);
    token.value = response.token;
    updateAuthToken(response.token);
    isAuthenticated.value = true;
    return response;
  }

  async function logout() {
    try {
      await profileService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      token.value = '';
      updateAuthToken(null);
      isAuthenticated.value = false;
      window.location.href = '/login';
    }
  }

  function checkAuth() {
    const storedToken = localStorage.getItem('token');
    token.value = storedToken || '';
    isAuthenticated.value = !!storedToken;
    return !!storedToken;
  }

  return {
    isAuthenticated,
    token,
    login,
    register,
    logout,
    checkAuth
  };
});
