# Frontend Architecture & Component Design

## 1. Project Overview

- **Framework**: Vue.js 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: npm
- **UI Libraries**: Element Plus & Vuetify
- **State Management**: Pinia
- **API Client**: Axios

## 2. Directory Structure

```
frontend/
├── public/                   # Static assets (index.html, favicon, robots.txt)
├── src/
│   ├── assets/               # CSS, images, SVGs, fonts
│   ├── components/           # Reusable UI components (cards, navbar, icons)
│   ├── composables/          # Vue 3 Composition API helpers (useAuth, useRecipes, useNotification)
│   ├── layouts/              # Layout components (DefaultLayout.vue, AuthLayout.vue)
│   ├── plugins/              # App plugins (vuetify.ts)
│   ├── router/               # Vue Router setup (index.ts)
│   ├── services/             # API services (api.ts, auth.service.ts, recipe.service.ts, user.service.ts, storage.service.ts)
│   ├── stores/               # Pinia stores (auth.store.ts, recipe.store.ts, notification.store.ts, etc.)
│   ├── types/                # TypeScript types (auth.types.ts, recipe.types.ts)
│   ├── utils/                # Utility functions (helpers, validators)
│   ├── views/                # Page-level components (LandingView.vue, LoginView.vue, etc.)
│   ├── App.vue               # Root component
│   └── main.ts               # Application entrypoint
├── .env.example              # Environment variables template
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── vitest.config.ts          # Vitest configuration
```

## 3. Core Components & Views

- **components/**: Low‑level, reusable UI building blocks (e.g. Navbar.vue, RecipeCard.vue, icon components).
- **views/**: Page‑level components mapped via Vue Router (LandingView.vue, RecipeListView.vue, RecipeDetailView.vue, etc.).

## 4. State Management (Pinia)

- **auth.store.ts**: Handles login, registration, logout, and profile fetch.
- **recipe.store.ts**: Manages fetching and caching of recipe lists and individual recipes.
- **notification.store.ts**: Manages toast/notification messages.

## 5. API Service Layer (Axios)

- **api.ts**: Configures Axios instance, sets base URL, injects auth token, and handles 401 errors.
- **auth.service.ts**: `/auth/login`, `/auth/register`, `/profile/logout`, `/profile`.
- **recipe.service.ts**: `/recipes`, `/recipes/:id`, `/recipes/:id/favorite`.
- **user.service.ts**: `/profile` (GET/PUT).
- **storage.service.ts**: Persists auth token in localStorage.

## 6. Plugins

- **plugins/vuetify.ts**: Vuetify plugin setup (theme, icons).

## 7. Router

- **router/index.ts**: Vue Router setup with route definitions and layout components.

## 8. Composables

- **useAuth.ts**: Authentication helper (login, register, logout, current user).
- **useRecipes.ts**: Recipe listing/detail helper.
- **useNotification.ts**: Notification helper (success, error, info).

## 9. Type Definitions

- **auth.types.ts**: Interfaces for User, LoginRequest, RegisterRequest, AuthResponse.
- **recipe.types.ts**: Interfaces for Recipe, Ingredient, Nutrition, etc.

## 10. Styling & Themes

- **Element Plus**: Core UI components and icons.
- **Vuetify**: Theme colors and layout components.