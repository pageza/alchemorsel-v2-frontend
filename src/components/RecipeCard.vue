<template>
  <div class="recipe-card" @click="$emit('click')">
    <img :src="image" :alt="name" class="recipe-image" />
    <div class="recipe-name">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ image: string; name: string }>()
</script>

<style scoped>
.recipe-card {
  background: #3a2a1a;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px 18px 8px;
  min-width: 220px;
  max-width: 240px;
  margin: 0 8px;
  cursor: pointer;
  transition: box-shadow 0.18s, transform 0.18s;
}
.recipe-card:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.28);
  transform: translateY(-2px) scale(1.03);
}
.recipe-image {
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}
.recipe-name {
  font-family: 'Merriweather', serif;
  font-size: 1.25rem;
  color: #f5e6c8;
  text-align: center;
  margin-top: 4px;
}
</style> 