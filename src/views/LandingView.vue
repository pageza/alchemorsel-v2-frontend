<template>
  <div class="landing-bg">
    <div class="hero-card">
      <div class="hero-content">
        <div class="hero-headline">Discover<br />Culinary<br />Magic</div>
        <div class="hero-subheadline">Your ultimate destination<br />for delicious recipes</div>
        <div class="hero-actions">
          <v-btn class="landing-btn" variant="outlined" color="#a86c3a" to="/login">Sign In</v-btn>
          <v-btn class="landing-btn" color="#a86c3a" to="/register">Register</v-btn>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" alt="Culinary Dish" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function goToSignIn() {
  router.push('/login')
}
function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
.landing-bg {
  background: #2d221a;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 96px;
}
.hero-card {
  background: #23190f;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: row;
  padding: 48px 48px 32px 64px;
  min-width: 900px;
  max-width: 1200px;
  min-height: 480px;
  position: relative;
}
.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 2;
}
.hero-headline {
  font-family: 'Merriweather', serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #f5e6c8;
  line-height: 1.1;
  margin-bottom: 24px;
}
.hero-subheadline {
  font-size: 1.25rem;
  color: #e0c9a6;
  margin-bottom: 48px;
}
.hero-actions {
  display: flex;
  gap: 20px;
  position: absolute;
  right: 48px;
  bottom: 32px;
}
.landing-btn {
  background: #3a2a1a;
  color: #f5e6c8;
  border: 1.5px solid #a67c52;
  font-weight: 500;
}
.hero-image {
  margin-left: 48px;
  align-self: flex-end;
  z-index: 1;
}
.hero-image img {
  width: 340px;
  height: 340px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  border: 6px solid #3a2a1a;
}
@media (max-width: 1200px) {
  .hero-card { min-width: 700px; }
  .hero-image img { width: 260px; height: 260px; }
}
</style> 