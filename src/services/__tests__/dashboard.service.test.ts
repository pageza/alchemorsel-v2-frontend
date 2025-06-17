import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DashboardService } from '../dashboard.service'
import api from '../api'

vi.mock('../api')

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getStats', () => {
    it('should fetch dashboard statistics', async () => {
      const mockStats = {
        recipesGenerated: 10,
        favorites: 5,
        thisWeek: 3,
        primaryDiet: 'Vegan'
      }

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockStats })

      const result = await DashboardService.getStats()

      expect(api.get).toHaveBeenCalledWith('/dashboard/stats')
      expect(result).toEqual(mockStats)
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('Network error')
      vi.mocked(api.get).mockRejectedValueOnce(error)

      await expect(DashboardService.getStats()).rejects.toThrow('Network error')
      expect(api.get).toHaveBeenCalledWith('/dashboard/stats')
    })
  })

  describe('getRecentFavorites', () => {
    it('should fetch recent favorite recipes', async () => {
      const mockRecipes = [
        {
          id: '1',
          name: 'Recipe 1',
          description: 'Description 1',
          ingredients: ['ingredient1'],
          instructions: ['step1'],
          category: 'Breakfast',
          cuisine: 'American',
          servings: 2,
          prepTime: 15,
          cookTime: 20,
          totalTime: 35,
          imageUrl: 'http://example.com/image1.jpg',
          userId: 'user123',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          isFavorite: true
        },
        {
          id: '2',
          name: 'Recipe 2',
          description: 'Description 2',
          ingredients: ['ingredient2'],
          instructions: ['step2'],
          category: 'Lunch',
          cuisine: 'Italian',
          servings: 4,
          prepTime: 20,
          cookTime: 30,
          totalTime: 50,
          imageUrl: 'http://example.com/image2.jpg',
          userId: 'user123',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          isFavorite: true
        }
      ]

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockRecipes })

      const result = await DashboardService.getRecentFavorites()

      expect(api.get).toHaveBeenCalledWith('/dashboard/favorites/recent')
      expect(result).toEqual(mockRecipes)
    })

    it('should return empty array when no favorites exist', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: [] })

      const result = await DashboardService.getRecentFavorites()

      expect(api.get).toHaveBeenCalledWith('/dashboard/favorites/recent')
      expect(result).toEqual([])
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('Failed to fetch favorites')
      vi.mocked(api.get).mockRejectedValueOnce(error)

      await expect(DashboardService.getRecentFavorites()).rejects.toThrow('Failed to fetch favorites')
      expect(api.get).toHaveBeenCalledWith('/dashboard/favorites/recent')
    })
  })
})