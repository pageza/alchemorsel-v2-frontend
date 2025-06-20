<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 font-weight-bold">
        Fork Recipe
      </v-card-title>
      
      <v-card-text>
        <p class="text-body-1 mb-4">
          Tell us what you'd like to change about this recipe and we'll create a customized version for you!
        </p>
        
        <v-textarea
          v-model="modificationRequest"
          label="What would you like to change?"
          placeholder="e.g., Make it vegan, reduce cooking time, add more spices, substitute ingredients..."
          rows="4"
          :rules="[v => !!v || 'Please describe what you want to change']"
          counter="500"
          maxlength="500"
          :disabled="isSubmitting"
        ></v-textarea>
        
        <v-alert
          v-if="isSubmitting"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          <v-progress-circular
            indeterminate
            size="small"
            class="mr-2"
          ></v-progress-circular>
          Creating your customized recipe... This may take a minute.
        </v-alert>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submitForkRequest"
          :loading="isSubmitting"
          :disabled="!modificationRequest.trim()"
        >
          Fork Recipe
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  recipeId?: string
  recipeName?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'fork-requested', data: { recipeId: string; modification: string; draftId: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const show = ref(false)
const modificationRequest = ref('')
const isSubmitting = ref(false)

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  show.value = newValue
})

// Watch for internal changes
watch(show, (newValue) => {
  emit('update:modelValue', newValue)
  if (!newValue) {
    // Reset form when closing
    modificationRequest.value = ''
    isSubmitting.value = false
  }
})

const close = () => {
  show.value = false
}

const submitForkRequest = async () => {
  if (!props.recipeId || !modificationRequest.value.trim()) return
  
  isSubmitting.value = true
  
  try {
    // Import LLMService dynamically to avoid circular dependencies
    const { LLMService } = await import('@/services/llm.service')
    
    // Send fork request to API
    const response = await LLMService.forkRecipe(modificationRequest.value.trim(), props.recipeId)
    
    if (response.draft_id) {
      // Success! Emit success event with draft ID
      emit('fork-requested', {
        recipeId: props.recipeId,
        modification: modificationRequest.value.trim(),
        draftId: response.draft_id
      })
      
      // Close modal after short delay to show success
      setTimeout(() => {
        close()
      }, 500)
    } else {
      throw new Error('No draft ID returned from fork request')
    }
  } catch (error) {
    console.error('Error submitting fork request:', error)
    alert('Failed to create forked recipe. Please try again.')
    isSubmitting.value = false
  }
}
</script>