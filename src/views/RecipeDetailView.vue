<template>
  <div class="recipe-detail">
    <div class="recipe-detail__container" v-if="recipe">
      <h1>{{ recipe.name }}</h1>
      <p class="recipe-detail__description">{{ recipe.description }}</p>
      
      <div class="recipe-detail__meta">
        <div class="meta-item">
          <span class="label">Prep Time:</span>
          <span class="value">{{ recipe.prep_time }}</span>
        </div>
        <div class="meta-item">
          <span class="label">Cook Time:</span>
          <span class="value">{{ recipe.cook_time }}</span>
        </div>
        <div class="meta-item">
          <span class="label">Servings:</span>
          <span class="value">{{ recipe.servings }}</span>
        </div>
        <div class="meta-item">
          <span class="label">Difficulty:</span>
          <span class="value">{{ recipe.difficulty }}</span>
        </div>
      </div>

      <div class="recipe-detail__section">
        <h2>Ingredients</h2>
        <ul class="ingredients-list">
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </div>

      <div class="recipe-detail__section">
        <h2>Instructions</h2>
        <ol class="instructions-list">
          <li v-for="(instruction, index) in recipe.instructions" :key="index">
            {{ instruction }}
          </li>
        </ol>
      </div>
    </div>
    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading recipe...</p>
    </div>
    <div v-else class="error-message">
      {{ error || 'Recipe not found' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { recipeService } from '@/services/api';

const route = useRoute();
const recipe = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const recipeId = route.params.id as string;
    recipe.value = await recipeService.getRecipe(recipeId);
  } catch (err: any) {
    console.error('Failed to load recipe:', err);
    error.value = err.message || 'Failed to load recipe';
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.recipe-detail {
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--background-color);

  &__container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 2rem;
  }

  &__description {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  &__meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #f8fafc;
    border-radius: 8px;

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .label {
        font-size: 0.9rem;
        color: #666;
      }

      .value {
        font-weight: 500;
        color: var(--text-color);
      }
    }
  }

  &__section {
    margin-bottom: 2rem;

    h2 {
      color: var(--primary-color);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
  }

  .ingredients-list {
    list-style: none;
    padding: 0;

    li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
      color: var(--text-color);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .instructions-list {
    padding-left: 1.5rem;

    li {
      margin-bottom: 1rem;
      line-height: 1.6;
      color: var(--text-color);
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;

    p {
      color: #666;
    }
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .error-message {
    text-align: center;
    color: #dc2626;
    padding: 2rem;
    background-color: #fee2e2;
    border-radius: 8px;
    margin: 2rem auto;
    max-width: 800px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}
</style> 