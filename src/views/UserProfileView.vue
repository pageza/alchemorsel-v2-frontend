<template>
  <div class="user-profile">
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
export default {
  data() {
    return {
      profile: {
        username: '',
        email: '',
      },
    };
  },
  methods: {
    async updateProfile() {
      // TODO: Implement API call to update profile
      console.log('Profile updated:', this.profile);
    },
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