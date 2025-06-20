<template>
  <v-card
    v-if="!isLoading && rateLimitStatus"
    :color="cardColor"
    variant="tonal"
    class="rate-limit-indicator"
  >
    <v-card-text class="py-2">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon :color="iconColor" size="20" class="mr-2">
            {{ icon }}
          </v-icon>
          <div>
            <div class="text-body-2 font-weight-medium">
              {{ title }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ statusText }}
            </div>
          </div>
        </div>
        
        <div class="text-right">
          <div class="text-h6 font-weight-bold">
            {{ rateLimitStatus.remaining }}/{{ rateLimitStatus.limit }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ resetText }}
          </div>
        </div>
      </div>
      
      <!-- Progress bar -->
      <v-progress-linear
        v-if="showProgress"
        :model-value="usagePercentage"
        :color="progressColor"
        height="4"
        class="mt-2"
        rounded
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RateLimitService, type RateLimitStatus } from '@/services/rate-limit.service'

interface Props {
  rateLimitStatus: RateLimitStatus | null
  isLoading?: boolean
  title: string
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  showProgress: true
})

// Computed properties
const usagePercentage = computed(() => {
  if (!props.rateLimitStatus) return 0
  return RateLimitService.getUsagePercentage(props.rateLimitStatus)
})

const isRateLimited = computed(() => {
  if (!props.rateLimitStatus) return false
  return RateLimitService.isRateLimited(props.rateLimitStatus)
})

const resetText = computed(() => {
  if (!props.rateLimitStatus) return ''
  const resetTime = RateLimitService.formatResetTime(props.rateLimitStatus.reset_time)
  return `Resets in ${resetTime}`
})

const statusText = computed(() => {
  if (!props.rateLimitStatus) return ''
  
  if (isRateLimited.value) {
    return 'Rate limit reached'
  }
  
  const remaining = props.rateLimitStatus.remaining
  if (remaining === 1) {
    return '1 request remaining'
  }
  
  return `${remaining} requests remaining`
})

// Visual styling
const cardColor = computed(() => {
  if (isRateLimited.value) return 'error'
  if (props.rateLimitStatus && props.rateLimitStatus.remaining <= 1) return 'warning'
  return 'success'
})

const iconColor = computed(() => {
  if (isRateLimited.value) return 'error'
  if (props.rateLimitStatus && props.rateLimitStatus.remaining <= 1) return 'warning'
  return 'success'
})

const icon = computed(() => {
  if (isRateLimited.value) return 'mdi-timer-off'
  if (props.rateLimitStatus && props.rateLimitStatus.remaining <= 1) return 'mdi-timer-alert'
  return 'mdi-timer-check'
})

const progressColor = computed(() => {
  if (usagePercentage.value >= 100) return 'error'
  if (usagePercentage.value >= 80) return 'warning'
  return 'success'
})
</script>

<style scoped>
.rate-limit-indicator {
  border-left: 4px solid currentColor;
}
</style>