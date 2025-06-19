import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LLMService } from '@/services/llm.service'
import type { RecipeDraft, LLMQueryResponse } from '@/services/llm.service'

// Mock the api module
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn()
  }
}))

// Import api after mocking
import api from '@/services/api'
const mockApi = vi.mocked(api)

describe('LLMService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateRecipe', () => {
    it('should successfully generate a recipe from query', async () => {
      const mockQuery = 'Create a vegetarian pasta recipe with mushrooms'
      
      const mockRecipeDraft: RecipeDraft = {
        id: 'draft-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        name: 'Vegetarian Mushroom Pasta',
        description: 'A delicious vegetarian pasta with fresh mushrooms',
        category: 'main',
        ingredients: [
          '400g pasta',
          '300g mixed mushrooms',
          '2 cloves garlic',
          '2 tbsp olive oil'
        ],
        instructions: [
          'Cook pasta according to package instructions',
          'Sauté mushrooms and garlic in olive oil',
          'Combine with pasta and serve'
        ],
        prep_time: '15 minutes',
        cook_time: '20 minutes',
        servings: { Value: '4' },
        difficulty: 'Easy',
        calories: 450,
        protein: 15,
        carbs: 65,
        fat: 18,
        user_id: 'user-123'
      }

      const mockResponse: LLMQueryResponse = {
        recipe: mockRecipeDraft,
        draft_id: 'draft-123'
      }

      mockApi.post.mockResolvedValue({ data: mockResponse })

      const result = await LLMService.generateRecipe(mockQuery)

      expect(mockApi.post).toHaveBeenCalledWith('/llm/query', {
        query: mockQuery,
        intent: 'generate',
        skip_similar_check: false
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty queries', async () => {
      const emptyQuery = ''

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Query cannot be empty' }
        }
      }

      mockApi.post.mockRejectedValue(mockError)

      await expect(LLMService.generateRecipe(emptyQuery)).rejects.toEqual(mockError)
    })

    it('should handle LLM service errors', async () => {
      const mockQuery = 'Generate a recipe'

      const mockError = {
        response: {
          status: 500,
          data: { message: 'LLM service temporarily unavailable' }
        }
      }

      mockApi.post.mockRejectedValue(mockError)

      await expect(LLMService.generateRecipe(mockQuery)).rejects.toEqual(mockError)
    })

    it('should handle rate limiting', async () => {
      const mockQuery = 'Generate a recipe'

      const mockError = {
        response: {
          status: 429,
          data: { message: 'Rate limit exceeded' }
        }
      }

      mockApi.post.mockRejectedValue(mockError)

      await expect(LLMService.generateRecipe(mockQuery)).rejects.toEqual(mockError)
    })
  })

  describe('modifyRecipe', () => {
    it('should successfully modify an existing recipe draft', async () => {
      const mockQuery = 'Make this recipe spicier'
      const draftId = 'draft-123'
      
      const mockModifiedDraft: RecipeDraft = {
        id: draftId,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T01:00:00Z',
        name: 'Spicy Pasta',
        description: 'A spicy pasta dish',
        category: 'main',
        ingredients: [
          '400g pasta',
          '300g mushrooms',
          '1 tsp chili flakes'
        ],
        instructions: [
          'Cook pasta',
          'Add chili flakes',
          'Serve hot'
        ],
        prep_time: '15 minutes',
        cook_time: '20 minutes',
        servings: { Value: '4' },
        difficulty: 'Easy',
        calories: 450,
        protein: 15,
        carbs: 65,
        fat: 18,
        user_id: 'user-123'
      }

      const mockResponse: LLMQueryResponse = {
        recipe: mockModifiedDraft,
        draft_id: draftId
      }

      mockApi.post.mockResolvedValue({ data: mockResponse })

      const result = await LLMService.modifyRecipe(mockQuery, draftId)

      expect(mockApi.post).toHaveBeenCalledWith('/llm/query', {
        query: mockQuery,
        intent: 'modify',
        draft_id: draftId
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle invalid draft ID', async () => {
      const mockQuery = 'Make this recipe spicier'
      const invalidDraftId = 'invalid-draft-id'

      const mockError = {
        response: {
          status: 404,
          data: { message: 'Draft not found' }
        }
      }

      mockApi.post.mockRejectedValue(mockError)

      await expect(LLMService.modifyRecipe(mockQuery, invalidDraftId)).rejects.toEqual(mockError)
    })

    it('should handle empty modification queries', async () => {
      const emptyQuery = ''
      const draftId = 'draft-123'

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Modification query cannot be empty' }
        }
      }

      mockApi.post.mockRejectedValue(mockError)

      await expect(LLMService.modifyRecipe(emptyQuery, draftId)).rejects.toEqual(mockError)
    })
  })

  describe('error handling', () => {
    it('should handle network timeouts', async () => {
      const mockQuery = 'Generate a recipe'

      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded'
      }

      mockApi.post.mockRejectedValue(timeoutError)

      await expect(LLMService.generateRecipe(mockQuery)).rejects.toEqual(timeoutError)
    })

    it('should handle authentication errors', async () => {
      const mockQuery = 'Generate a recipe'

      const authError = {
        response: {
          status: 401,
          data: { message: 'Authentication required' }
        }
      }

      mockApi.post.mockRejectedValue(authError)

      await expect(LLMService.generateRecipe(mockQuery)).rejects.toEqual(authError)
    })
  })
})