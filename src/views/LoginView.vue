<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const username = ref('');
    const password = ref('');

    const login = async () => {
      try {
        const response = await axios.post('/api/login', { username: username.value, password: password.value });
        console.log('Login successful:', response.data);
        // Redirect to profile page or handle login success
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    return { username, password, login };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style> 