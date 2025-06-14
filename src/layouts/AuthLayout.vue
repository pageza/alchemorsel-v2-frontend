<template>
  <el-container>
    <el-main class="auth-container">
      <el-row class="fill-height" :gutter="0">
        <!-- Left side - Auth form -->
        <el-col :xs="24" :md="12" class="auth-form-col">
          <div class="auth-form-container">
            <router-view></router-view>
          </div>
        </el-col>

        <!-- Right side - Decorative image/pattern -->
        <el-col :xs="0" :md="12" class="auth-background">
          <div class="auth-image-container">
            <el-image
              src="@/assets/auth-pattern.svg"
              :max-width="400"
              class="auth-pattern"
            ></el-image>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
// Component logic can be added here if needed
</script>

<style scoped>
.auth-container {
  padding: 0;
  height: 100vh;
}

.fill-height {
  height: 100%;
}

.auth-form-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form-container {
  padding: 4rem 2rem;
  width: 100%;
  max-width: 600px;
}

.auth-background {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-image-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-pattern {
  opacity: 0.5;
}

@media (max-width: 768px) {
  .auth-form-container {
    padding: 2rem 1rem;
  }
}
</style> 