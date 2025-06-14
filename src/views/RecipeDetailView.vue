<template>
  <div>
    <!-- Recipe Header -->
    <v-container class="py-8">
      <v-row>
        <v-col cols="12" md="8">
          <div class="d-flex align-center mb-4">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              class="mr-4"
              @click="$router.back()"
            ></v-btn>
            <v-chip color="primary" class="mr-2">
              {{ recipe.category }}
            </v-chip>
            <v-chip
              color="secondary"
              variant="outlined"
            >
              {{ recipe.cookingTime }} mins
            </v-chip>
          </div>
          <h1 class="text-h3 font-weight-bold mb-4">{{ recipe.name }}</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-6">
            {{ recipe.description }}
          </p>
          <div class="d-flex align-center mb-6">
            <v-avatar
              :image="recipe.author.avatar"
              size="40"
              class="mr-3"
            ></v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                {{ recipe.author.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Posted {{ recipe.createdAt }}
              </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-heart-outline"
              variant="text"
              class="mr-2"
            ></v-btn>
            <v-btn
              icon="mdi-share-variant"
              variant="text"
            ></v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <v-img
            :src="recipe.imageUrl"
            height="400"
            cover
            class="rounded-lg"
          ></v-img>
        </v-col>
      </v-row>
    </v-container>

    <!-- Recipe Content -->
    <v-container class="py-8">
      <v-row>
        <!-- Left Column - Ingredients -->
        <v-col cols="12" md="4">
          <v-card class="mb-6">
            <v-card-title class="text-h5 font-weight-bold">
              Ingredients
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(ingredient, index) in recipe.ingredients"
                  :key="index"
                  :title="ingredient.name"
                  :subtitle="ingredient.amount"
                >
                  <template v-slot:prepend>
                    <v-checkbox-btn></v-checkbox-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title class="text-h5 font-weight-bold">
              Nutrition
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(nutrition, key) in recipe.nutrition"
                  :key="key"
                  :title="key"
                  :subtitle="nutrition"
                ></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column - Instructions -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-h5 font-weight-bold">
              Instructions
            </v-card-title>
            <v-card-text>
              <v-timeline density="compact" align="start">
                <v-timeline-item
                  v-for="(step, index) in recipe.instructions"
                  :key="index"
                  :dot-color="'primary'"
                  size="small"
                >
                  <template v-slot:opposite>
                    <div class="text-h6 font-weight-bold">
                      Step {{ index + 1 }}
                    </div>
                  </template>
                  <div class="text-body-1">
                    {{ step }}
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>

          <!-- Comments Section -->
          <v-card class="mt-6">
            <v-card-title class="text-h5 font-weight-bold">
              Comments
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="comment in recipe.comments"
                  :key="comment.id"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      :image="comment.author.avatar"
                      size="40"
                    ></v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    {{ comment.author.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ comment.text }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipes } from '@/composables/useRecipes'

const route = useRoute()
const router = useRouter()
const { fetchRecipeById, getRecipeById } = useRecipes()

// Load recipe by ID
onMounted(() => {
  fetchRecipeById(route.params.id as string)
})

const recipe = getRecipeById(route.params.id as string)
    'Tear the mozzarella into pieces and distribute them over the sauce.',
    'Bake for 12-15 minutes until the crust is golden and the cheese is bubbly.',
    'Remove from oven, top with fresh basil leaves, and drizzle with olive oil.',
    'Slice and serve immediately.'
  ],
  nutrition: {
    'Calories': '266 kcal',
    'Protein': '11g',
    'Carbohydrates': '33g',
    'Fat': '10g',
    'Fiber': '2g'
  },
  comments: [
    {
      id: 1,
      author: {
        name: 'Sarah M.',
        avatar: 'https://picsum.photos/100/100?random=3'
      },
      text: 'This recipe is amazing! I added some garlic to the sauce and it was perfect.'
    },
    {
      id: 2,
      author: {
        name: 'Mike R.',
        avatar: 'https://picsum.photos/100/100?random=4'
      },
      text: 'I tried this with gluten-free dough and it worked great. Thanks for the recipe!'
    }
  ]
</script>

<style scoped>
.v-timeline-item__body {
  margin-bottom: 24px;
}
</style> 