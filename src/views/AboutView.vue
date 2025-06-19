<template>
  <div class="about-page">
    <!-- Hero Section -->
    <v-container fluid class="hero-section">
      <v-row justify="center" align="center" class="hero-content">
        <v-col cols="12" md="8" lg="6" class="text-center">
          <h1 class="display-1 font-weight-bold mb-6">
            About Alchemorsel
          </h1>
          <p class="headline mb-4">
            Transforming home cooking with AI-powered recipe creation
          </p>
          <p class="text-body-1">
            We believe everyone deserves access to personalized, safe, and delicious recipes that fit their unique dietary needs and preferences.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Mission Section -->
    <v-container class="mission-section">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h3 text-center mb-8">Our Mission</h2>
          <div class="text-center">
            <p class="text-h6 mb-6 font-weight-light">
              To democratize personalized cooking by making it easy for anyone to create amazing recipes that respect their dietary restrictions, preferences, and lifestyle.
            </p>
            <p class="text-body-1">
              Whether you're managing food allergies, following a specific diet, or simply looking for new culinary inspiration, Alchemorsel's AI technology ensures every recipe is tailored specifically for you.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Features Section -->
    <v-container class="features-section">
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="text-h3 mb-4">What Makes Us Different</h2>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="text-center mb-6">
          <v-icon size="72" color="primary" class="mb-4">mdi-brain</v-icon>
          <h3 class="text-h5 mb-3">AI Technology</h3>
          <p>Advanced artificial intelligence creates unique recipes based on your preferences, not just keyword matching.</p>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="text-center mb-6">
          <v-icon size="72" color="primary" class="mb-4">mdi-shield-check</v-icon>
          <h3 class="text-h5 mb-3">Safety First</h3>
          <p>Rigorous dietary restriction enforcement ensures recipes are safe for your allergies and lifestyle choices.</p>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="text-center mb-6">
          <v-icon size="72" color="primary" class="mb-4">mdi-account-heart</v-icon>
          <h3 class="text-h5 mb-3">Personalization</h3>
          <p>Every recipe is tailored to your unique taste preferences, cooking skill level, and available time.</p>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="text-center mb-6">
          <v-icon size="72" color="primary" class="mb-4">mdi-chef-hat</v-icon>
          <h3 class="text-h5 mb-3">Culinary Excellence</h3>
          <p>Recipes are designed with proper cooking techniques and balanced flavors for restaurant-quality results.</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Story Section -->
    <v-container class="story-section">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h3 text-center mb-8">Our Story</h2>
          <div class="story-content">
            <p class="text-body-1 mb-4">
              Alchemorsel was born from a simple observation: everyone has unique dietary needs, but most recipe platforms treat all users the same. Whether someone is managing celiac disease, following a vegan lifestyle, or dealing with multiple food allergies, finding safe and delicious recipes shouldn't be a struggle.
            </p>
            <p class="text-body-1 mb-4">
              Our team of food technologists, AI engineers, and culinary experts came together to solve this problem. We built an AI system that doesn't just suggest recipes—it creates them from scratch, taking into account every aspect of your dietary profile and preferences.
            </p>
            <p class="text-body-1">
              Today, Alchemorsel helps thousands of home cooks discover new flavors while staying true to their dietary needs. Every recipe generated is a unique creation, designed specifically for you.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Values Section -->
    <v-container class="values-section">
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="text-h3 mb-4">Our Values</h2>
        </v-col>
        <v-col cols="12" md="4" class="mb-6">
          <v-card class="pa-6 text-center h-100" elevation="2">
            <v-icon size="48" color="primary" class="mb-4">mdi-heart-pulse</v-icon>
            <h3 class="text-h5 mb-3">Health & Safety</h3>
            <p>We prioritize your health above all else. Our AI rigorously checks every recipe against your dietary restrictions and allergies.</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" class="mb-6">
          <v-card class="pa-6 text-center h-100" elevation="2">
            <v-icon size="48" color="primary" class="mb-4">mdi-lightbulb</v-icon>
            <h3 class="text-h5 mb-3">Innovation</h3>
            <p>We continuously improve our AI technology to provide more accurate, creative, and delicious recipe suggestions.</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" class="mb-6">
          <v-card class="pa-6 text-center h-100" elevation="2">
            <v-icon size="48" color="primary" class="mb-4">mdi-account-group</v-icon>
            <h3 class="text-h5 mb-3">Community</h3>
            <p>We believe cooking brings people together. Our platform fosters a community of food lovers sharing their culinary journeys.</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call to Action -->
    <v-container class="cta-section">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6" class="text-center">
          <h2 class="text-h4 mb-4">{{ isAuthenticated ? 'Start Creating' : 'Join Our Community' }}</h2>
          <p class="text-body-1 mb-6">
            {{ isAuthenticated 
              ? 'Ready to create some amazing recipes? Head to the generator and start cooking!'
              : 'Join thousands of home cooks who have discovered the joy of personalized recipe creation.'
            }}
          </p>
          <v-btn
            v-if="!isAuthenticated"
            color="primary"
            size="large"
            @click="$router.push('/register')"
          >
            Get Started Free
          </v-btn>
          <v-btn
            v-else
            color="primary"
            size="large"
            @click="$router.push('/generate')"
          >
            Generate a Recipe
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: white;
  min-height: 50vh;
  display: flex;
  align-items: center;
}

.hero-content {
  min-height: 50vh;
}

.mission-section {
  padding: 4rem 0;
}

.features-section {
  padding: 4rem 0;
  background-color: rgb(var(--v-theme-surface));
}

.story-section {
  padding: 4rem 0;
}

.story-content {
  font-size: 1.1rem;
  line-height: 1.7;
}

.values-section {
  padding: 4rem 0;
  background-color: rgb(var(--v-theme-surface));
}

.cta-section {
  padding: 4rem 0;
}
</style>