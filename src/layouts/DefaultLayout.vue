<template>
  <Navbar />
  <div class="main-bg"><router-view /></div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
.main-bg {
  background: #2d221a;
  min-height: 100vh;
  width: 100vw;
  padding-top: 64px;
}
</style> 