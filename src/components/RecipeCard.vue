<template>
  <div class="recipe-card" @click="$emit('click')">
    <div class="recipe-image-container">
      <img :src="image" :alt="name" class="recipe-image" />
      <button 
        v-if="showFavoriteButton"
        class="favorite-button"
        :class="{ 'is-favorite': isFavorite }"
        @click.stop="handleFavoriteClick"
        :disabled="isLoading"
      >
        <v-icon :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" />
      </button>
    </div>
    <div class="recipe-name">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ 
  image: string
  name: string
  isFavorite?: boolean
  showFavoriteButton?: boolean
  id?: string
}>()

const emit = defineEmits<{
  click: []
  favoriteToggle: [recipeId: string]
}>()

const isLoading = ref(false)

const handleFavoriteClick = async () => {
  isLoading.value = true
  try {
    emit('favoriteToggle', props.id || '')  // Use the recipe ID from props
  } finally {
    isLoading.value = false
  }
}
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

.recipe-image-container {
  position: relative;
  margin-bottom: 12px;
}

.recipe-image {
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
}

.favorite-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.favorite-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.favorite-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.favorite-button .v-icon {
  color: #fff;
  font-size: 18px;
}

.favorite-button.is-favorite .v-icon {
  color: #ff4757;
}

.recipe-name {
  font-family: 'Merriweather', serif;
  font-size: 1.25rem;
  color: #f5e6c8;
  text-align: center;
  margin-top: 4px;
}
</style> 