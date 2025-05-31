<script setup lang="ts">
interface Macros {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  macros: Macros
}

defineProps<{
  recipe: Recipe
}>()
</script>

<template>
  <div class="recipe-card">
    <h3>{{ recipe.title }}</h3>
    <p>{{ recipe.description }}</p>
    <div class="macros">
      <span>{{ recipe.macros.calories }} cal</span>
      <span>{{ recipe.macros.protein }}g protein</span>
      <span>{{ recipe.macros.carbs }}g carbs</span>
      <span>{{ recipe.macros.fat }}g fat</span>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 1rem 0;
}

.macros {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}
</style> 