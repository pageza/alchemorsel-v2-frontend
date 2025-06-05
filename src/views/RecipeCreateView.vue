<template>
  <div class="create-recipe">
    <div class="create-recipe__container">
      <h1>Create New Recipe</h1>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <form class="create-recipe__form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="query">What would you like to cook?</label>
          <p class="form-hint">
            Our AI chef will create a complete recipe based on your request. You can be as specific or general as you'd like. For example:
            <br>- "A healthy chicken dish with vegetables"
            <br>- "Kosher meal using potatoes and carrots"
            <br>- "Turkey dinner, 450 calories per serving, 4 servings"
            <br>- "Quick vegetarian pasta dish under 30 minutes"
            <br>- "Low-carb dinner with beef and broccoli"
          </p>
          <textarea
            id="query"
            v-model="query"
            required
            :disabled="loading"
            minlength="2"
            maxlength="500"
            placeholder="Describe what you'd like to cook..."
            class="query-input"
          ></textarea>
          <p class="form-hint">
            The AI will generate a complete recipe including ingredients, instructions, nutrition info, and more!
          </p>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Our AI chef is creating your recipe...</p>
        </div>

        <div v-if="rawRecipe" class="raw-recipe">
          <h2>Generated Recipe Preview</h2>
          <pre class="raw-recipe__content">{{ JSON.stringify(rawRecipe, null, 2) }}</pre>
          <div class="raw-recipe__actions">
            <button type="button" class="btn btn-secondary" @click="handleEdit">Edit Recipe</button>
            <button type="button" class="btn btn-primary" @click="handleSave">Save Recipe</button>
          </div>
        </div>

        <button v-if="!rawRecipe" type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Creating Recipe...' : 'Generate Recipe' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { recipeService } from "@/services/api";
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const error = ref<string | null>(null);
const query = ref("");
const rawRecipe = ref<any>(null);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await recipeService.generateRecipe(query.value);
    console.log("Generated recipe response:", response);
    rawRecipe.value = response;  // Store the recipe data directly
  } catch (err: any) {
    console.error("Failed to create recipe:", err);
    error.value = err.message || "Failed to generate recipe. Please try again.";
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  // Create a form to edit the recipe
  const recipe = rawRecipe.value.recipe; // Access the recipe from the response object
  const form = document.createElement('form');
  form.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <h2 style="margin-bottom: 1rem;">Edit Recipe</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem;">Name</label>
            <input type="text" id="recipe-name" value="${recipe.name}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem;">Description</label>
            <textarea id="recipe-description" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; min-height: 100px;">${recipe.description}</textarea>
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem;">Ingredients (one per line)</label>
            <textarea id="recipe-ingredients" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; min-height: 150px;">${Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : ''}</textarea>
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem;">Instructions (one per line)</label>
            <textarea id="recipe-instructions" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; min-height: 200px;">${Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : ''}</textarea>
          </div>
          <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
            <button type="button" id="cancel-edit" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">Cancel</button>
            <button type="submit" style="padding: 0.5rem 1rem; border: none; border-radius: 4px; background: var(--primary-color); color: white; cursor: pointer;">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('recipe-name') as HTMLInputElement).value;
    const description = (document.getElementById('recipe-description') as HTMLTextAreaElement).value;
    const ingredients = (document.getElementById('recipe-ingredients') as HTMLTextAreaElement).value.split('\n').filter(i => i.trim());
    const instructions = (document.getElementById('recipe-instructions') as HTMLTextAreaElement).value.split('\n').filter(i => i.trim());

    rawRecipe.value = {
      ...rawRecipe.value,
      recipe: {
        ...recipe,
        name,
        description,
        ingredients,
        instructions
      }
    };

    document.body.removeChild(form);
  });

  form.querySelector('#cancel-edit')?.addEventListener('click', () => {
    document.body.removeChild(form);
  });

  document.body.appendChild(form);
};

const handleSave = async () => {
  try {
    if (!authStore.isAuthenticated) {
      router.push('/login');
      return;
    }

    loading.value = true;
    error.value = null;
    
    // Format the recipe data according to the backend's expected structure
    const recipeData = {
      name: rawRecipe.value.name,
      description: rawRecipe.value.description,
      category: rawRecipe.value.category || 'Uncategorized',
      ingredients: rawRecipe.value.ingredients,
      instructions: rawRecipe.value.instructions,
      prep_time: rawRecipe.value.prep_time,
      cook_time: rawRecipe.value.cook_time,
      servings: rawRecipe.value.servings,
      difficulty: rawRecipe.value.difficulty
    };
    
    const response = await recipeService.saveRecipe(recipeData);
    if (response.id) {
      router.push({ name: 'RecipeDetail', params: { id: response.id } });
    } else {
      throw new Error("No recipe ID received from server");
    }
  } catch (err: any) {
    console.error("Failed to save recipe:", err);
    error.value = err.message || "Failed to save recipe. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.create-recipe {
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

  .error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  h1 {
    text-align: center;
    color: var(--primary-color);
    margin-bottom: 2rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 500;
      color: var(--text-color);
      font-size: 1.2rem;
    }

    .form-hint {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
  }

  .query-input {
    width: 100%;
    min-height: 150px;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: #f8fafc;
    border-radius: 4px;

    p {
      color: #666;
      font-size: 0.9rem;
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

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &-primary {
      background-color: var(--primary-color);
      color: white;

      &:hover:not(:disabled) {
        background-color: var(--primary-color-dark);
        transform: translateY(-1px);
      }
    }
  }

  .raw-recipe {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    h2 {
      color: var(--primary-color);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    &__content {
      background-color: #1e293b;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    &__actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
  }

  .btn-secondary {
    background-color: #64748b;
    color: white;

    &:hover {
      background-color: #475569;
    }
  }
}
</style>     