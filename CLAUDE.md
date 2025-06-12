# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run test` - Run tests with Vitest

### API Schema Generation
- `npm run generate:schema` - Generate TypeScript definitions from OpenAPI spec located at `../jaqpot-api/src/main/resources/openapi.yaml`

### Testing
- Tests use Vitest with jsdom environment
- Run single test: `npm run test -- path/to/test.test.tsx`
- Run tests in watch mode: `npm run test -- --watch`

## Architecture Overview

### Core Technologies
- **Next.js 14** with App Router (not Pages Router)
- **NextAuth v5** for authentication with Keycloak provider
- **NextUI** for UI components with Tailwind CSS
- **SWR** for data fetching and caching
- **Zustand** for client-side state management
- **TypeScript** with strict typing

### Project Structure
- **App Router**: All routes are in `src/app/` following Next.js 13+ conventions
- **API Routes**: Backend endpoints in `src/app/api/` that proxy to the Jaqpot API
- **Dashboard Layout**: Main application UI in `src/app/dashboard/` with nested layouts
- **Authentication**: Centralized in `src/auth.ts` using NextAuth with Keycloak

### Key Architectural Patterns

#### Authentication Flow
- Uses NextAuth v5 with Keycloak provider
- JWT tokens are managed automatically with refresh token rotation
- Session data includes the access token for backend API calls
- User settings (like dark mode) are fetched from API and stored in Zustand

#### API Integration
- TypeScript definitions auto-generated from OpenAPI spec (`src/app/api.schema.d.ts`)
- All API calls go through Next.js API routes that proxy to the backend
- Authentication headers automatically added using session tokens

#### Component Organization
- Dashboard components in `src/app/dashboard/components/`
- Reusable UI components in `src/components/ui/`
- Page-specific components colocated with their routes

#### Data Flow
- **SWR** for server state (API data fetching, caching, revalidation)
- **Zustand** for client state (user settings, UI state)
- **NextAuth** session for authentication state

### Environment Requirements
- Node.js >=18.17.0
- API_URL environment variable for backend API
- Keycloak configuration (AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_SECRET, AUTH_KEYCLOAK_ISSUER)

### Model Management Features
The application focuses on:
- Model upload, modification, and management
- Real-time predictions using stored models
- Dataset management and results visualization
- Organization-based access control
- Advanced charting and visualization (Recharts, heatmaps)

### Styling and Theming
- Tailwind CSS with NextUI components
- Dark mode support via user settings stored in backend
- Custom CSS modules for specific components (e.g., Logo component)

### Key Files for Understanding Codebase
- `src/auth.ts` - Authentication configuration and token management
- `src/app/layout.tsx` - Root layout with user settings integration
- `src/app/providers.tsx` - Client-side providers (NextUI, toast notifications)
- `src/app/dashboard/layout.tsx` - Main dashboard layout structure
- `src/app/api.schema.d.ts` - Auto-generated API types (do not edit manually)