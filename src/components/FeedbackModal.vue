<template>
  <v-dialog v-model="showModal" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon left>mdi-bug-report</v-icon>
        Report Bug / Feedback
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-select
            v-model="formData.type"
            :items="typeOptions"
            label="Type"
            required
            :rules="[rules.required]"
            data-testid="feedback-type"
            class="mb-3"
          />
          
          <v-text-field
            v-model="formData.title"
            label="Title"
            required
            counter="200"
            :rules="[rules.required, rules.maxLength(200)]"
            data-testid="feedback-title"
            class="mb-3"
          />
          
          <v-textarea
            v-model="formData.description"
            label="Description"
            required
            counter="2000"
            rows="5"
            :rules="[rules.required, rules.maxLength(2000)]"
            data-testid="feedback-description"
            placeholder="Please describe what happened or what you'd like to suggest. Include as much detail as possible - what you were doing, what you expected to happen, and what actually happened."
            class="mb-3"
          />
          
          <v-select
            v-model="formData.priority"
            :items="priorityOptions"
            label="Priority"
            data-testid="feedback-priority"
            class="mb-3"
          />
          
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-3"
          >
            <template v-slot:text>
              <small>
                Session information (browser, current page) will be automatically included to help us debug the issue.
              </small>
            </template>
          </v-alert>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeModal"
          :disabled="isSubmitting"
          data-testid="feedback-cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="submitFeedback"
          :loading="isSubmitting"
          :disabled="!valid"
          data-testid="feedback-submit"
        >
          Submit Feedback
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import { FeedbackService } from '@/services/feedback.service'

interface FeedbackData {
  type: string
  title: string
  description: string
  priority: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref()
const valid = ref(false)
const isSubmitting = ref(false)

const formData = ref<FeedbackData>({
  type: '',
  title: '',
  description: '',
  priority: 'medium'
})

const typeOptions = [
  { title: 'Bug Report', value: 'bug' },
  { title: 'Feature Request', value: 'feature' },
  { title: 'General Feedback', value: 'general' }
]

const priorityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
  { title: 'Critical', value: 'critical' }
]

const rules = {
  required: (value: string) => !!value || 'This field is required',
  maxLength: (max: number) => (value: string) => 
    !value || value.length <= max || `Must be ${max} characters or less`
}

const resetForm = () => {
  formData.value = {
    type: '',
    title: '',
    description: '',
    priority: 'medium'
  }
  if (form.value) {
    form.value.resetValidation()
  }
}

const closeModal = () => {
  if (!isSubmitting.value) {
    showModal.value = false
    resetForm()
  }
}

const collectSessionInfo = () => {
  return {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent
  }
}

const submitFeedback = async () => {
  if (!form.value?.validate() || !valid.value) {
    return
  }

  isSubmitting.value = true

  try {
    const sessionInfo = collectSessionInfo()
    
    const feedbackData = {
      type: formData.value.type,
      title: formData.value.title,
      description: formData.value.description,
      priority: formData.value.priority,
      user_agent: sessionInfo.userAgent,
      url: sessionInfo.url
    }

    await FeedbackService.createFeedback(feedbackData)
    
    notificationStore.success('Thank you! Your feedback has been submitted successfully.')
    closeModal()
  } catch (error) {
    console.error('Error submitting feedback:', error)
    notificationStore.error('Failed to submit feedback. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Auto-focus the type field when modal opens
onMounted(() => {
  if (showModal.value) {
    // Focus the first field after a short delay to ensure modal is fully opened
    setTimeout(() => {
      const typeField = document.querySelector('[data-testid="feedback-type"]')
      if (typeField) {
        (typeField as HTMLElement).focus()
      }
    }, 100)
  }
})
</script>

<style scoped>
.v-card-title {
  background-color: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>