import api from './api'

export interface RecipeDraft {
  id: string
  created_at: string
  updated_at: string
  name: string
  description: string
  category: string
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
}
