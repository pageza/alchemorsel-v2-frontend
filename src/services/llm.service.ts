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
  similar_recipes?: any[] // Will use Recipe type from recipe service
  message?: string
}

export class LLMService {
  static async generateRecipe(query: string, skipSimilarCheck = false): Promise<LLMQueryResponse> {
    const response = await api.post('/llm/query', {
      query,
      intent: 'generate',
      skip_similar_check: skipSimilarCheck
    }, {
      timeout: 120000 // 2 minutes timeout for LLM operations
    })
    return response.data
  }

  static async modifyRecipe(query: string, draftId: string): Promise<LLMQueryResponse> {
    const response = await api.post('/llm/query', {
      query,
      intent: 'modify',
      draft_id: draftId
    }, {
      timeout: 120000 // 2 minutes timeout for LLM operations
    })
    return response.data
  }

  static async forkRecipe(query: string, recipeId: string): Promise<LLMQueryResponse> {
    const response = await api.post('/llm/query', {
      query,
      intent: 'fork',
      recipe_id: recipeId
    }, {
      timeout: 120000 // 2 minutes timeout for LLM operations
    })
    return response.data
  }
}