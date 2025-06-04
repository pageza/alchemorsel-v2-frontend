import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RecipeCard from '../RecipeCard.vue'

describe('RecipeCard', () => {
  it('renders recipe title correctly', () => {
    const recipe = {
      id: '1',
      title: 'Test Recipe',
      description: 'A test recipe',
      ingredients: [],
      steps: [],
      macros: {
        calories: 500,
        protein: 20,
        carbs: 50,
        fat: 25
      }
    }

    const wrapper = mount(RecipeCard, {
      props: {
        recipe
      }
    })

    expect(wrapper.text()).toContain('Test Recipe')
  })

  it('displays macros information', () => {
    const recipe = {
      id: '1',
      title: 'Test Recipe',
      description: 'A test recipe',
      ingredients: [],
      steps: [],
      macros: {
        calories: 500,
        protein: 20,
        carbs: 50,
        fat: 25
      }
    }

    const wrapper = mount(RecipeCard, {
      props: {
        recipe
      }
    })

    expect(wrapper.text()).toContain('500')
    expect(wrapper.text()).toContain('20g')
    expect(wrapper.text()).toContain('50g')
    expect(wrapper.text()).toContain('25g')
  })
}) 