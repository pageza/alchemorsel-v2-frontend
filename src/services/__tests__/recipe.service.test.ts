import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RecipeService } from '@/services/recipe.service'
import type { Recipe } from '@/types/recipe.types'
import type { RecipeDraft } from '@/services/llm.service'

// Mock the api module
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Import api after mocking
import api from '@/services/api'
const mockApi = vi.mocked(api)

describe('RecipeService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRecipes', () => {
    it('should successfully fetch all recipes', async () => {
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Test Recipe',
          description: 'A test recipe',
          ingredients: ['ingredient1'],
          instructions: ['step1'],
          category: 'main',
          cuisine: 'italian',
          dietary_preferences: [],
          tags: [],
          calories: 300,
          protein: 20,
          carbs: 30,
          fat: 10,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          user_id: 'user1'
        }
      ]

      mockApi.get.mockResolvedValue({ data: { recipes: mockRecipes } })

      const result = await RecipeService.getRecipes()

      expect(mockApi.get).toHaveBeenCalledWith('/recipes')
      expect(result).toEqual(mockRecipes)
    })

    it('should handle direct array response format', async () => {
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Test Recipe',
          description: 'A test recipe',
          ingredients: ['ingredient1'],
          instructions: ['step1'],
          category: 'main',
          cuisine: 'italian',
          dietary_preferences: [],
          tags: [],
          calories: 300,
          protein: 20,
          carbs: 30,
          fat: 10,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          user_id: 'user1'
        }
      ]

      mockApi.get.mockResolvedValue({ data: mockRecipes })

      const result = await RecipeService.getRecipes()

      expect(result).toEqual(mockRecipes)
    })
  })

  describe('getRecipeById', () => {
    it('should successfully fetch a recipe by ID', async () => {
      const mockRecipe: Recipe = {
        id: '1',
        name: 'Test Recipe',
        description: 'A detailed test recipe',
        ingredients: ['2 cups flour'],
        instructions: ['Mix ingredients'],
        category: 'dessert',
        cuisine: 'american',
        dietary_preferences: ['vegetarian'],
        tags: ['sweet'],
        calories: 400,
        protein: 8,
        carbs: 70,
        fat: 12,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        user_id: 'user1'
      }

      mockApi.get.mockResolvedValue({ data: { recipe: mockRecipe } })

      const result = await RecipeService.getRecipeById('1')

      expect(mockApi.get).toHaveBeenCalledWith('/recipes/1')
      expect(result).toEqual(mockRecipe)
    })

    it('should handle recipe not found error', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Recipe not found' }
        }
      }

      mockApi.get.mockRejectedValue(mockError)

      await expect(RecipeService.getRecipeById('nonexistent')).rejects.toEqual(mockError)
    })
  })

  describe('createRecipe', () => {
    it('should successfully create a new recipe', async () => {
      const newRecipeData = {
        name: 'New Recipe',
        description: 'A brand new recipe',
        ingredients: ['ingredient1'],
        instructions: ['step1'],
        category: 'main',
        cuisine: 'mexican',
        dietary_preferences: ['gluten-free'],
        tags: ['spicy'],
        calories: 350,
        protein: 25,
        carbs: 35,
        fat: 15
      }

      const createdRecipe: Recipe = {
        ...newRecipeData,
        id: 'new-recipe-id',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        user_id: 'current-user'
      }

      mockApi.post.mockResolvedValue({ data: { recipe: createdRecipe } })

      const result = await RecipeService.createRecipe(newRecipeData)

      expect(mockApi.post).toHaveBeenCalledWith('/recipes', newRecipeData)
      expect(result).toEqual(createdRecipe)
    })
  })

  describe('createRecipeFromDraft', () => {
    it('should successfully create recipe from draft', async () => {
      const mockDraft: RecipeDraft = {
        id: 'draft-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        name: 'Draft Recipe',
        description: 'A recipe from draft',
        category: 'main',
        ingredients: ['ingredient1'],
        instructions: ['step1'],
        prep_time: '15 minutes',
        cook_time: '20 minutes',
        servings: { Value: '4' },
        difficulty: 'Easy',
        calories: 400,
        protein: 30,
        carbs: 40,
        fat: 18,
        user_id: 'user-123'
      }

      const expectedRecipeData = {
        name: mockDraft.name,
        description: mockDraft.description,
        category: mockDraft.category,
        cuisine: '',
        ingredients: mockDraft.ingredients,
        instructions: mockDraft.instructions,
        calories: mockDraft.calories,
        protein: mockDraft.protein,
        carbs: mockDraft.carbs,
        fat: mockDraft.fat,
        dietary_preferences: [],
        tags: []
      }

      const createdRecipe: Recipe = {
        ...expectedRecipeData,
        id: 'draft-recipe-id',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        user_id: 'current-user'
      }

      mockApi.post.mockResolvedValue({ data: { recipe: createdRecipe } })

      const result = await RecipeService.createRecipeFromDraft(mockDraft)

      expect(mockApi.post).toHaveBeenCalledWith('/recipes', expectedRecipeData)
      expect(result).toEqual(createdRecipe)
    })
  })

  describe('updateRecipe', () => {
    it('should successfully update a recipe', async () => {
      const updateData = {
        name: 'Updated Recipe Name',
        calories: 500
      }

      const updatedRecipe: Recipe = {
        id: '1',
        name: 'Updated Recipe Name',
        description: 'Updated description',
        ingredients: ['ingredient1'],
        instructions: ['step1'],
        category: 'main',
        cuisine: 'italian',
        dietary_preferences: [],
        tags: [],
        calories: 500,
        protein: 20,
        carbs: 30,
        fat: 10,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        user_id: 'user1'
      }

      mockApi.put.mockResolvedValue({ data: updatedRecipe })

      const result = await RecipeService.updateRecipe('1', updateData)

      expect(mockApi.put).toHaveBeenCalledWith('/recipes/1', updateData)
      expect(result).toEqual(updatedRecipe)
    })
  })

  describe('deleteRecipe', () => {
    it('should successfully delete a recipe', async () => {
      mockApi.delete.mockResolvedValue({ data: {} })

      await RecipeService.deleteRecipe('1')

      expect(mockApi.delete).toHaveBeenCalledWith('/recipes/1')
    })
  })

  describe('toggleFavorite', () => {
    it('should successfully favorite a recipe when not currently favorited', async () => {
      const mockResponse = {
        is_favorite: true,
        message: 'Recipe added to favorites'
      }
      mockApi.post.mockResolvedValue({ data: mockResponse })

      const result = await RecipeService.toggleFavorite('1', false)

      expect(mockApi.post).toHaveBeenCalledWith('/recipes/1/favorite')
      expect(result).toEqual(mockResponse)
    })

    it('should successfully unfavorite a recipe when currently favorited', async () => {
      const mockResponse = {
        is_favorite: false,
        message: 'Recipe removed from favorites'
      }
      mockApi.delete.mockResolvedValue({ data: mockResponse })

      const result = await RecipeService.toggleFavorite('1', true)

      expect(mockApi.delete).toHaveBeenCalledWith('/recipes/1/favorite')
      expect(result).toEqual(mockResponse)
    })

    it('should handle 409 conflict by unfavoriting', async () => {
      const conflictError = {
        response: { status: 409 }
      }
      const mockResponse = {
        is_favorite: false,
        message: 'Recipe removed from favorites'
      }

      mockApi.post.mockRejectedValueOnce(conflictError)
      mockApi.delete.mockResolvedValue({ data: mockResponse })

      const result = await RecipeService.toggleFavorite('1', false)

      expect(mockApi.post).toHaveBeenCalledWith('/recipes/1/favorite')
      expect(mockApi.delete).toHaveBeenCalledWith('/recipes/1/favorite')
      expect(result).toEqual(mockResponse)
    })

    it('should handle 404 not found by favoriting', async () => {
      const notFoundError = {
        response: { status: 404 }
      }
      const mockResponse = {
        is_favorite: true,
        message: 'Recipe added to favorites'
      }

      mockApi.delete.mockRejectedValueOnce(notFoundError)
      mockApi.post.mockResolvedValue({ data: mockResponse })

      const result = await RecipeService.toggleFavorite('1', true)

      expect(mockApi.delete).toHaveBeenCalledWith('/recipes/1/favorite')
      expect(mockApi.post).toHaveBeenCalledWith('/recipes/1/favorite')
      expect(result).toEqual(mockResponse)
    })

    it('should throw errors that are not 409 or 404', async () => {
      const serverError = {
        response: { status: 500 }
      }

      mockApi.post.mockRejectedValue(serverError)

      await expect(RecipeService.toggleFavorite('1', false)).rejects.toEqual(serverError)
    })
  })
})