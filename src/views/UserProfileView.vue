<template>
  <div>
    <h1>User Profile</h1>
    <form @submit.prevent="updateProfile">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="profile.username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="profile.email" required />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const profile = ref({ username: '', email: '' });

    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile');
        profile.value = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const updateProfile = async () => {
      try {
        await axios.put('/api/user/profile', profile.value);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };

    onMounted(fetchProfile);

    return { profile, updateProfile };
  },
};
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style> 