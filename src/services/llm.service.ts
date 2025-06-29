import api from './api'

export interface RecipeDraft {
  id: string
  created_at: string
  updated_at: string
  name: string
  description: string
  category: string
  cuisine: string
  image_url: string
  ingredients: string[]
  instructions: string[]
  prep_time: string
  cook_time: string
  servings: {
    Value: string
  }
  difficulty: string
  calories: number
  protein: number
  carbs: number
  fat: number
  calories_per_serving: number
  protein_per_serving: number
  carbs_per_serving: number
  fat_per_serving: number
  user_id: string
}

export interface LLMQueryRequest {
  query: string
  intent: 'generate' | 'modify' | 'fork'
  draft_id?: string
  recipe_id?: string
  skip_similar_check?: boolean
}

export interface LLMQueryResponse {
  recipe?: RecipeDraft
  draft_id?: string
  // ESLINT-FIX-2025-H: Replace 'any[]' with proper Recipe array type
  similar_recipes?: Array<{ [key: string]: unknown }> // Generic recipe objects from API
  message?: string
}

// Multi-call recipe generation types
export interface BasicRecipeRequest {
  query: string
}

export interface BasicRecipeResponse {
  draft_id: string
  recipe: {
    name: string
    description: string
    category: string
    cuisine: string
    ingredients: string[]
    instructions: string[]
    prep_time: string
    cook_time: string
    servings: { value: string }
    difficulty: string
  }
  status: string
}

export interface NutritionRequest {
  draft_id: string
}

export interface NutritionResponse {
  draft_id: string
  calories: number
  protein: number
  carbs: number
  fat: number
  status: string
}

export interface FinalizeRequest {
  draft_id: string
}

export interface FinalizeResponse {
  draft_id: string
  recipe: RecipeDraft
  status: string
}

// Image generation interfaces
export interface GenerateRecipeImageRequest {
  draft_id: string
}

export interface GenerateRecipeImageResponse {
  draft_id: string
  image_url: string
  status: string
  message?: string
}

export interface GenerateImageFromPromptRequest {
  prompt: string
  size?: string
}

export interface GenerateImageFromPromptResponse {
  image_url: string
  status: string
  message?: string
}

export class LLMService {
  // Legacy methods for backward compatibility
  static async generateRecipe(query: string, skipSimilarCheck = false): Promise<LLMQueryResponse> {
    const response = await api.post(
      '/llm/query',
      {
        query,
        intent: 'generate',
        skip_similar_check: skipSimilarCheck,
      },
      {
        timeout: 120000, // 2 minutes timeout for LLM operations
      },
    )
    return response.data
  }

  static async modifyRecipe(query: string, draftId: string): Promise<LLMQueryResponse> {
    const response = await api.post(
      '/llm/query',
      {
        query,
        intent: 'modify',
        draft_id: draftId,
      },
      {
        timeout: 120000, // 2 minutes timeout for LLM operations
      },
    )
    return response.data
  }

  static async forkRecipe(query: string, recipeId: string): Promise<LLMQueryResponse> {
    const response = await api.post(
      '/llm/query',
      {
        query,
        intent: 'fork',
        recipe_id: recipeId,
      },
      {
        timeout: 120000, // 2 minutes timeout for LLM operations
      },
    )
    return response.data
  }

  // New multi-call recipe generation methods
  static async generateBasicRecipe(query: string): Promise<BasicRecipeResponse> {
    const response = await api.post('/llm/generate-basic', { query }, {
      timeout: 60000, // 1 minute timeout for basic generation
    })
    return response.data
  }

  static async calculateNutrition(draftId: string): Promise<NutritionResponse> {
    const response = await api.post('/llm/calculate-nutrition', { draft_id: draftId }, {
      timeout: 30000, // 30 seconds timeout for nutrition calculation
    })
    return response.data
  }

  static async finalizeRecipe(draftId: string): Promise<FinalizeResponse> {
    const response = await api.post('/llm/finalize-recipe', { draft_id: draftId }, {
      timeout: 30000, // 30 seconds timeout for finalization
    })
    return response.data
  }

  // Progressive recipe generation workflow
  static async generateRecipeProgressive(
    query: string,
    onBasicGenerated?: (basic: BasicRecipeResponse) => void,
    onNutritionCalculated?: (nutrition: NutritionResponse) => void,
  ): Promise<FinalizeResponse> {
    // Step 1: Generate basic recipe
    const basicResponse = await this.generateBasicRecipe(query)
    if (onBasicGenerated) {
      onBasicGenerated(basicResponse)
    }

    // Step 2: Calculate nutrition
    try {
      const nutritionResponse = await this.calculateNutrition(basicResponse.draft_id)
      if (onNutritionCalculated) {
        onNutritionCalculated(nutritionResponse)
      }
    } catch (error) {
      console.warn('Failed to calculate nutrition:', error)
      // Continue without nutrition data
    }

    // Step 3: Finalize recipe
    const finalResponse = await this.finalizeRecipe(basicResponse.draft_id)
    return finalResponse
  }

  // Image generation methods
  static async generateRecipeImage(draftId: string): Promise<GenerateRecipeImageResponse> {
    const response = await api.post('/images/generate-recipe', { draft_id: draftId }, {
      timeout: 60000, // 1 minute timeout for image generation
    })
    return response.data
  }

  static async generateImageFromPrompt(prompt: string, size = '1024x1024'): Promise<GenerateImageFromPromptResponse> {
    const response = await api.post('/images/generate', { prompt, size }, {
      timeout: 60000, // 1 minute timeout for image generation
    })
    return response.data
  }

  // Enhanced progressive recipe generation with optional image generation
  static async generateRecipeProgressiveWithImage(
    query: string,
    onBasicGenerated?: (basic: BasicRecipeResponse) => void,
    onNutritionCalculated?: (nutrition: NutritionResponse) => void,
    onImageGenerated?: (imageResponse: GenerateRecipeImageResponse) => void,
    generateImage = true,
  ): Promise<FinalizeResponse> {
    // Step 1: Generate basic recipe
    const basicResponse = await this.generateBasicRecipe(query)
    if (onBasicGenerated) {
      onBasicGenerated(basicResponse)
    }

    // Step 2: Calculate nutrition
    try {
      const nutritionResponse = await this.calculateNutrition(basicResponse.draft_id)
      if (onNutritionCalculated) {
        onNutritionCalculated(nutritionResponse)
      }
    } catch (error) {
      console.warn('Failed to calculate nutrition:', error)
      // Continue without nutrition data
    }

    // Step 3: Generate image if requested
    if (generateImage) {
      try {
        const imageResponse = await this.generateRecipeImage(basicResponse.draft_id)
        if (onImageGenerated) {
          onImageGenerated(imageResponse)
        }
      } catch (error) {
        console.warn('Failed to generate image:', error)
        // Continue without image
      }
    }

    // Step 4: Finalize recipe
    const finalResponse = await this.finalizeRecipe(basicResponse.draft_id)
    return finalResponse
  }
}
