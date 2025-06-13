<template>
  <div class="recipes-bg">
    <div class="featured-header">Featured Recipes</div>
    <div class="featured-carousel">
      <div class="carousel-row">
        <RecipeCard v-for="recipe in featuredRecipes" :key="recipe.name" :image="recipe.image" :name="recipe.name" @click="goToRecipe(recipe)" />
      </div>
    </div>
    <div class="search-row">
      <v-text-field
        v-model="search"
        class="search-input"
        placeholder="Search recipes..."
        hide-details
        variant="solo"
        rounded
        prepend-inner-icon="mdi-filter"
        append-inner-icon="mdi-sort"
      />
      <v-btn class="search-btn">Search</v-btn>
    </div>
    <div class="recipes-grid">
      <RecipeCard v-for="recipe in recipes" :key="recipe.name" :image="recipe.image" :name="recipe.name" @click="goToRecipe(recipe)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RecipeCard from '@/components/RecipeCard.vue'

const router = useRouter()
const search = ref('')

const allRecipes = [
  { name: 'Lasagna', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Avocaado Toast', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chickpea Salad', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { name: 'Spaghetti Carbonara', image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1547592180-8717c3c36c5b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Caesar Salad', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pancakes', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Caprese Salad', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Beef Stroganoff', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Vegetable Stir Fry', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
]

function getRandomRecipes(count: number) {
  const shuffled = [...allRecipes].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const featuredRecipes = getRandomRecipes(6)
const recipes = allRecipes

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function goToRecipe(recipe) {
  router.push({ name: 'recipe-detail', params: { id: slugify(recipe.name) } })
}
</script>

<style scoped>
.recipes-bg {
  background: #2d221a;
  min-height: 100vh;
  width: 100vw;
  padding: 48px 0 0 0;
}
.featured-header {
  font-family: 'Merriweather', serif;
  font-size: 2.2rem;
  color: #f5e6c8;
  margin-left: 48px;
  margin-bottom: 18px;
}
.featured-carousel {
  overflow-x: auto;
  padding-left: 40px;
  margin-bottom: 32px;
}
.carousel-row {
  display: flex;
  flex-direction: row;
  gap: 18px;
  min-width: 720px;
}
.search-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 48px 32px 48px;
}
.search-input {
  background: #e6d3b3;
  border-radius: 12px;
  font-size: 1.1rem;
  flex: 1;
  min-width: 0;
}
.search-btn {
  background: #a86c3a;
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 10px;
  padding: 0 32px;
  height: 48px;
  box-shadow: none;
}
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 32px;
  margin: 0 48px 48px 48px;
}
</style> 