<template>
  <div id="app">
    <router-view></router-view>
    
    <!-- Global feedback button - available on all pages -->
    <FeedbackButton />
    
    <!-- Global notification toasts -->
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import FeedbackButton from '@/components/FeedbackButton.vue'
import NotificationToast from '@/components/NotificationToast.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

#app {
  width: 100vw;
  min-height: 100vh;
}

/* Global styles */
.el-container {
  width: 100% !important;
}

.el-main {
  width: 100% !important;
  padding: 0 !important;
}
</style>

