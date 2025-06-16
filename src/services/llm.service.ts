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
  intent: 'generate' | 'modify'
  draft_id?: string
}

export interface LLMQueryResponse {
  recipe: RecipeDraft
  draft_id: string
}

export class LLMService {
  static async generateRecipe(query: string): Promise<LLMQueryResponse> {
    const response = await api.post('/llm/query', {
      query,
      intent: 'generate'
    })
    return response.data
  }

  static async modifyRecipe(query: string, draftId: string): Promise<LLMQueryResponse> {
    const response = await api.post('/llm/query', {
      query,
      intent: 'modify',
      draft_id: draftId
    })
    return response.data
  }
}