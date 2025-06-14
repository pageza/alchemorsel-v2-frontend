<template>
  <div class="landing-root">
    <!-- Hero Section -->
    <el-row class="landing-hero" justify="center" align="middle">
      <el-col :span="12" class="hero-left">
        <h1 class="hero-title">Transform Your Cooking Experience</h1>
        <p class="hero-subtitle">
          Discover, create, and share your culinary masterpieces with Alchemorsel
        </p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" class="mr-4">Get Started</el-button>
          <el-button type="primary" plain size="large">Browse Recipes</el-button>
        </div>
      </el-col>
      <el-col :span="12" class="hero-right">
        <!-- Placeholder for hero image/illustration -->
        <div class="hero-image-placeholder">Image</div>
      </el-col>
    </el-row>

    <!-- Features Section -->
    <el-row class="landing-features" justify="center">
      <el-col :span="24" class="text-center mb-8">
        <h2 class="section-title">Why Choose Alchemorsel?</h2>
        <p class="section-subtitle">Everything you need to elevate your cooking game</p>
      </el-col>
      <el-col :span="8" class="feature-col text-center">
        <el-icon size="48" color="var(--el-color-primary)" class="mb-2">
          <Document />
        </el-icon>
        <h3 class="feature-title">Curated Recipes</h3>
        <p>Access a vast collection of carefully curated recipes from professional chefs and home cooks</p>
      </el-col>
      <el-col :span="8" class="feature-col text-center">
        <el-icon size="48" color="var(--el-color-primary)" class="mb-2">
          <UserFilled />
        </el-icon>
        <h3 class="feature-title">Community Driven</h3>
        <p>Join a vibrant community of food enthusiasts and share your culinary journey</p>
      </el-col>
      <el-col :span="8" class="feature-col text-center">
        <el-icon size="48" color="var(--el-color-primary)" class="mb-2">
          <Light />
        </el-icon>
        <h3 class="feature-title">Smart Features</h3>
        <p>Get personalized recommendations and smart cooking tips based on your preferences</p>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Document, UserFilled, Light } from '@element-plus/icons-vue'
</script>

<style scoped>
.landing-root {
  background: #fff;
  min-height: 100vh;
  padding-top: 32px;
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.landing-hero {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 64px auto;
}

.hero-left {
  padding-left: 48px;
  padding-right: 24px;
}

.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.hero-buttons {
  margin-bottom: 1rem;
}

.hero-image-placeholder {
  width: 320px;
  height: 320px;
  background: #f2f2f2;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #bbb;
}

.landing-features {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--el-text-color-secondary);
}

.feature-col {
  padding: 32px 24px;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.text-center {
  text-align: center;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mr-4 {
  margin-right: 1rem;
}
</style> 