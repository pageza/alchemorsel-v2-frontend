# Alchemorsel Frontend

A modern Vue 3 frontend for the Alchemorsel recipe management application.

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vuetify 3 for UI components
- Pinia for state management
- Vue Router for routing
- Axios for API communication
- Vitest for testing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── composables/     # Vue composables
├── layouts/         # Layout components
├── pages/          # Page components
├── router/         # Vue Router configuration
├── services/       # API services
├── stores/         # Pinia stores
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Docker Development

The frontend is configured to work with Docker. The development server will be available at `http://localhost:5173` and will proxy API requests to the backend at `http://localhost:8080/api/v1`.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
