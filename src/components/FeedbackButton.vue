<template>
  <div class="feedback-button-container">
    <!-- Floating Action Button -->
    <v-btn
      icon
      color="primary"
      size="large"
      class="feedback-fab"
      @click="openModal"
      data-testid="feedback-fab"
      elevation="6"
    >
      <v-icon>mdi-help</v-icon>
    </v-btn>

    <!-- Feedback Modal -->
    <FeedbackModal v-model="showModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FeedbackModal from './FeedbackModal.vue'

const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}
</script>

<style scoped>
.feedback-button-container {
  position: relative;
}

.feedback-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  transition: all 0.3s ease;
}

.feedback-fab:hover {
  transform: scale(1.1);
}

/* Responsive positioning */
@media (max-width: 768px) {
  .feedback-fab {
    bottom: 16px;
    right: 16px;
    z-index: 999; /* Ensure it doesn't interfere with mobile nav */
  }
}

/* Dark theme support */
.v-theme--dark .feedback-fab {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
</style>