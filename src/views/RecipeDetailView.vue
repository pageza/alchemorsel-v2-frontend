<template>
  <div class="detail-bg">
    <div class="detail-card">
      <v-btn class="back-arrow" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <img :src="recipe.image" :alt="recipe.name" class="detail-image" />
      <div class="detail-title">{{ recipe.name }}</div>
      <div class="detail-meta">
        <span>{{ recipe.time }}</span>
        <span>•</span>
        <span>{{ recipe.kcal }} kcal</span>
        <span>•</span>
        <span>{{ recipe.type }}</span>
      </div>
      <div class="detail-controls">
        <div class="servings-group">
          <div class="label">Servings</div>
          <div class="servings-input">
            <v-btn icon @click="decrementServings">-</v-btn>
            <span class="servings-value">{{ servings }}</span>
            <v-btn icon @click="incrementServings">+</v-btn>
          </div>
        </div>
        <div class="unit-group">
          <div class="label">Unit</div>
          <div class="unit-toggle">
            <v-btn :variant="unit === 'US' ? 'flat' : 'outlined'" @click="unit = 'US'">US</v-btn>
            <v-btn :variant="unit === 'Metric' ? 'flat' : 'outlined'" @click="unit = 'Metric'">Metric</v-btn>
          </div>
        </div>
      </div>
      <v-btn class="modify-btn" @click="goToEdit">Modify</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const servings = ref(4)
const unit = ref('US')

function decrementServings() {
  if (servings.value > 1) servings.value--
}
function incrementServings() {
  servings.value++
}

function goBack() {
  router.push('/recipes')
}

function goToEdit() {
  router.push({ name: 'recipe-edit', params: { id: route.params.id } })
}

const allRecipes = [
  { name: 'Chocolate Chip Cookies', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', time: '30 min', kcal: 250, type: 'Dessert' },
  // ...add more as needed
]

const recipe = computed(() => {
  const name = route.params.name?.toString().replace(/-/g, ' ')
  return allRecipes.find(r => r.name.toLowerCase() === name?.toLowerCase()) || allRecipes[0]
})
</script>

<style scoped>
.detail-bg {
  background: #23190f;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 48px;
}
.detail-card {
  background: #2d221a;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 48px 32px 48px;
  min-width: 600px;
  max-width: 700px;
  position: relative;
}
.detail-image {
  width: 420px;
  height: 260px;
  object-fit: cover;
  border-radius: 18px;
  margin-bottom: 32px;
}
.detail-title {
  font-family: 'Merriweather', serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #f5e6c8;
  text-align: center;
  margin-bottom: 18px;
}
.detail-meta {
  color: #e0c9a6;
  font-size: 1.2rem;
  margin-bottom: 36px;
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
}
.detail-controls {
  display: flex;
  flex-direction: row;
  gap: 64px;
  margin-bottom: 36px;
  width: 100%;
  justify-content: center;
}
.label {
  color: #f5e6c8;
  font-size: 1.1rem;
  margin-bottom: 8px;
  text-align: center;
}
.servings-group, .unit-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.servings-input {
  display: flex;
  align-items: center;
  background: #3a2a1a;
  border-radius: 10px;
  padding: 4px 18px;
  gap: 18px;
}
.servings-value {
  color: #f5e6c8;
  font-size: 1.3rem;
  font-family: 'Merriweather', serif;
  min-width: 32px;
  text-align: center;
}
.unit-toggle {
  display: flex;
  gap: 8px;
  background: #3a2a1a;
  border-radius: 10px;
  padding: 4px 12px;
}
.modify-btn {
  background: #a86c3a;
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
  border-radius: 12px;
  margin-top: 18px;
  padding: 10px 48px;
}
.back-arrow {
  position: absolute;
  top: 18px;
  left: 18px;
  color: #e0c9a6;
  background: #3a2a1a;
  border-radius: 50%;
  box-shadow: none;
  z-index: 2;
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  transition: background 0.18s;
}
.back-arrow:hover, .back-arrow:focus {
  background: #4a3622;
}
</style> 