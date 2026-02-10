# Style and Conventions

## Formatting

- `.editorconfig`: spaces, indent size 2
- `.prettierrc`: semicolons, single quotes, trailing commas disabled, print width 120, LF endings
- In-code indentation often appears as 4 spaces in TS/TSX output; follow file-local style and existing formatter behavior.

## Linting

- ESLint 9 + TypeScript ESLint recommended rules (`eslint.config.js`)
- React hooks plugin + react-refresh rule (`only-export-components` warning)

## Code Patterns

- Functional React components; route composition in `src/App.tsx`
- Service layer under `src/services/*` wrapping axios/http calls
- Query hooks under `src/hooks/*` using TanStack Query
- Constants and route helpers centralized in `src/constants/RouteConfig.ts`
- TypeScript interfaces for domain models and service responses in `src/models` and `src/utils/types`

## Naming

- Hooks prefixed with `use...`
- Services use verb-based exports (`get...`, etc.)
- Route keys are PascalCase; route path helpers use `getPath` / `getFullPath`
