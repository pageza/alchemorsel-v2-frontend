<template>
  <div class="create-bg">
    <div class="create-header">Create Recipe</div>
    <div class="create-content">
      <div class="input-card">
        <div class="input-label">Describe the recipe you'd like to create:</div>
        <textarea v-model="description" class="input-textarea" rows="7" />
        <div class="input-actions">
          <v-btn class="adjust-btn">Adjust</v-btn>
          <v-btn class="save-btn">Save</v-btn>
        </div>
      </div>
      <div class="preview-card">
        <div class="preview-label">Preview</div>
        <div class="preview-title">{{ preview.title }}</div>
        <div class="preview-section">Ingredients</div>
        <ul class="preview-list">
          <li v-for="item in preview.ingredients" :key="item">{{ item }}</li>
        </ul>
        <div class="preview-section">Instructions</div>
        <ol class="preview-list">
          <li v-for="step in preview.instructions" :key="step">{{ step }}</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const description = ref('A vegetarian pasta dish featuring seasonal vegetables')

const preview = computed(() => {
  // Simulate preview generation from description
  // In real app, this would call an API or use a smarter parser
  if (!description.value.trim()) {
    return {
      title: 'Recipe Preview',
      ingredients: [],
      instructions: []
    }
  }
  return {
    title: 'Vegetable Pasta',
    ingredients: [
      '8 oz pasta (es, penne or fusilli)',
      '2 cups chopped seasonal vegetables (e.g., bell pepper, zucchini, cherry tomatoes)',
      '2 tbsp olive oil',
      '2 cloves garlic, minced',
      'Salt and pepper',
      '¼ cup grated Parmesan cheese'
    ],
    instructions: [
      'Cook pasta according to package instructions.',
      'Sauté garlic and vegetables. Season and combine with pasta.',
      'Serve with grated Parmesan cheese.'
    ]
  }
})
</script>

<style scoped>
.create-bg {
  background: #2d221a;
  min-height: 100vh;
  width: 100vw;
  padding: 48px 0 0 0;
}
.create-header {
  font-family: 'Merriweather', serif;
  font-size: 2.2rem;
  color: #f5e6c8;
  margin-left: 64px;
  margin-bottom: 28px;
}
.create-content {
  display: flex;
  flex-direction: row;
  gap: 48px;
  justify-content: center;
}
.input-card, .preview-card {
  background: #3a2a1a;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  padding: 32px 32px 28px 32px;
  min-width: 340px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.input-label, .preview-label {
  color: #f5e6c8;
  font-size: 1.18rem;
  font-weight: 600;
  margin-bottom: 16px;
}
.input-textarea {
  width: 100%;
  min-height: 120px;
  background: #2d221a;
  color: #f5e6c8;
  border: 2px solid #a67c52;
  border-radius: 10px;
  font-size: 1.1rem;
  padding: 14px;
  margin-bottom: 32px;
  font-family: inherit;
  resize: vertical;
}
.input-actions {
  display: flex;
  gap: 18px;
  width: 100%;
  justify-content: flex-start;
}
.adjust-btn {
  background: #e6d3b3;
  color: #3a2a1a;
  font-weight: 600;
  font-size: 1.08rem;
  border-radius: 8px;
  box-shadow: none;
  padding: 0 28px;
}
.save-btn {
  background: #d2691e;
  color: #fff;
  font-weight: 700;
  font-size: 1.08rem;
  border-radius: 8px;
  box-shadow: none;
  padding: 0 28px;
}
.preview-card {
  min-width: 340px;
  max-width: 400px;
}
.preview-title {
  font-family: 'Merriweather', serif;
  font-size: 1.5rem;
  color: #f5e6c8;
  margin-bottom: 18px;
  margin-top: 8px;
}
.preview-section {
  color: #e0c9a6;
  font-size: 1.08rem;
  font-weight: 600;
  margin-top: 12px;
  margin-bottom: 6px;
}
.preview-list {
  color: #fffbe6;
  font-size: 1.05rem;
  margin-bottom: 10px;
  padding-left: 20px;
}
</style> 