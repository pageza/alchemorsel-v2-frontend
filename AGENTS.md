# Frontend Development Guidelines

## 📦 Project Overview
- Framework: Vue.js 3
- Language: TypeScript
- Build Tool: Vite
- Package Manager: npm
- Testing Framework: Vitest
- Component Library: Custom components with Tailwind CSS
- State Management: Pinia
- API Client: Axios

## 🎯 Coding Standards
- Follow Vue.js 3 Composition API best practices
- Use TypeScript for all new code
- Follow the [Vue.js Style Guide](https://vuejs.org/style-guide/)
- Use ESLint and Prettier for code formatting
- Maintain consistent component naming (PascalCase)
- Keep components focused and single-responsibility
- Use TypeScript interfaces for all props and emits

## 📁 Project Structure
- `/src/components`: Reusable Vue components
- `/src/views`: Page-level components
- `/src/stores`: Pinia stores
- `/src/types`: TypeScript type definitions
- `/src/api`: API client and endpoints
- `/src/utils`: Utility functions
- `/src/assets`: Static assets
- `/src/router`: Vue Router configuration
- `/src/composables`: Reusable composition functions
- `/tests`: Test files

## 🧪 Testing Guidelines
- Write unit tests for all components
- Use Vitest for testing
- Achieve minimum 80% code coverage
- Test component props, events, and state changes
- Use Vue Test Utils for component testing
- Mock API calls in tests

## 🔐 Security Practices
- Never store sensitive data in localStorage
- Use HTTP-only cookies for authentication
- Implement CSRF protection
- Sanitize user inputs
- Use Content Security Policy
- Keep dependencies up to date
- Use environment variables for configuration

## 🛠️ Development Workflow
1. Create a new branch for each feature
2. Write tests before implementing features
3. Follow the Git workflow in the root AGENTS.md
4. Push changes directly to the frontend repository
5. Create PRs in the frontend repository only

## 🎨 UI/UX Guidelines
- Follow Material Design principles
- Use Tailwind CSS for styling
- Maintain consistent spacing and typography
- Ensure responsive design
- Follow accessibility guidelines (WCAG 2.1)
- Use semantic HTML elements
- Implement proper ARIA attributes

## 📦 Component Structure
```vue
<template>
  <!-- Template content -->
</template>

<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'

// Props
const props = defineProps<{
  title: string
  items: Array<Item>
}>()

// Emits
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}>()

// State
const count = ref(0)

// Methods
const increment = () => {
  count.value++
}

// Lifecycle hooks
onMounted(() => {
  // Initialization
})
</script>

<style scoped>
/* Component styles */
</style>
```

## 🔄 State Management
- Use Pinia for global state
- Keep stores modular and focused
- Use TypeScript for store definitions
- Implement proper error handling
- Use actions for async operations
- Keep state normalized

## 📡 API Integration
- Use Axios for API calls
- Implement proper error handling
- Use TypeScript interfaces for API responses
- Implement request/response interceptors
- Handle loading and error states
- Use environment variables for API URLs

## 🚀 Performance Guidelines
- Lazy load routes and components
- Optimize images and assets
- Use proper caching strategies
- Implement code splitting
- Monitor bundle size
- Use performance monitoring tools

## 📝 Pull Request Guidelines
- Title format: `[Component] Brief description`
- Include:
  - Summary of changes
  - Related issues
  - Testing performed
  - Screenshots for UI changes
  - Any breaking changes

## 👥 Code Review Process
- At least one approval required
- Use GitHub's review features
- Check for:
  - TypeScript types
  - Component structure
  - Test coverage
  - Performance impact
  - Accessibility

## 🧰 Development Tools
- VS Code with Volar extension
- Vue DevTools
- Chrome DevTools
- ESLint
- Prettier
- TypeScript
- Vitest

## 📅 Release Management
- Follow Semantic Versioning
- Update CHANGELOG.md
- Tag releases in Git
- Document breaking changes
- Update documentation

## 🧾 License
- This project is licensed under the MIT License 