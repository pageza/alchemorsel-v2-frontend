import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService, profileService } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!localStorage.getItem('token'));

  async function login(credentials: { email: string; password: string }) {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    isAuthenticated.value = true;
    return response;
  }

  async function register(data: { name: string; email: string; password: string }) {
    const response = await authService.register(data);
    localStorage.setItem('token', response.token);
    isAuthenticated.value = true;
    return response;
  }

  async function logout() {
    try {
      await profileService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      isAuthenticated.value = false;
      window.location.href = '/login';
    }
  }

  function checkAuth() {
    const token = localStorage.getItem('token');
    isAuthenticated.value = !!token;
    return !!token;
  }

  return { isAuthenticated, login, register, logout, checkAuth };
});
