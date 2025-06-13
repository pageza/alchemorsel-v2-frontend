<template>
  <div class="profile-bg">
    <div class="profile-header-card">
      <div class="profile-avatar">
        <v-icon size="80">mdi-account-circle</v-icon>
      </div>
      <div class="profile-info">
        <div class="profile-username">david_k</div>
        <div class="profile-bio">Food enthusiast and home cook</div>
        <v-btn class="edit-btn" variant="outlined" @click="goToEditProfile">Edit Profile</v-btn>
      </div>
    </div>
    <div class="my-recipes-section">
      <div class="my-recipes-title">My Recipes</div>
      <div class="my-recipes-grid">
        <div v-for="recipe in recipes" :key="recipe.title" class="my-recipe-card">
          <img :src="recipe.image" :alt="recipe.title" class="my-recipe-img" />
          <div class="my-recipe-title">{{ recipe.title }}</div>
          <div class="my-recipe-time">{{ recipe.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goToEditProfile() {
  router.push('/profile/edit')
}
const recipes = [
  {
    title: 'Spaghetti Carbonara',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?auto=format&fit=crop&w=400&q=80',
    time: '20 min'
  },
  {
    title: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    time: '25 min'
  },
  {
    title: 'Chocolate Cake',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    time: '60 min'
  }
]
</script>

<style scoped>
.profile-bg {
  background: #232325;
  min-height: 100vh;
  width: 100vw;
  padding: 0;
}
.profile-header-card {
  background: #3a2a1a;
  border-radius: 0 0 32px 32px;
  box-shadow: 0 2px 18px rgba(0,0,0,0.13);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 36px;
  padding: 48px 64px 38px 64px;
  margin-bottom: 38px;
}
.profile-avatar {
  background: #6b4a2a;
  border-radius: 50%;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.profile-username {
  font-family: 'Merriweather', serif;
  font-size: 2.4rem;
  color: #f5e6c8;
  font-weight: 700;
}
.profile-bio {
  color: #e0c9a6;
  font-size: 1.18rem;
  margin-bottom: 8px;
}
.edit-btn {
  color: #f5e6c8 !important;
  border: 1.5px solid #e0c9a6 !important;
  background: none !important;
  font-weight: 500;
  font-size: 1.08rem;
  border-radius: 8px;
  text-transform: none;
  min-width: 0;
  padding: 0 24px;
}
.edit-btn:hover, .edit-btn:focus {
  background: #4a3622 !important;
}
.my-recipes-section {
  margin: 0 64px;
}
.my-recipes-title {
  font-family: 'Merriweather', serif;
  font-size: 1.6rem;
  color: #f5e6c8;
  margin-bottom: 24px;
  margin-top: 18px;
}
.my-recipes-grid {
  display: flex;
  flex-direction: row;
  gap: 32px;
}
.my-recipe-card {
  background: #3a2a1a;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 220px;
  max-width: 240px;
  padding: 0 0 18px 0;
}
.my-recipe-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
  margin-bottom: 12px;
}
.my-recipe-title {
  font-family: 'Merriweather', serif;
  font-size: 1.18rem;
  color: #f5e6c8;
  margin-left: 18px;
  margin-top: 2px;
}
.my-recipe-time {
  color: #e0c9a6;
  font-size: 1rem;
  margin-left: 18px;
  margin-top: 2px;
}
</style> 