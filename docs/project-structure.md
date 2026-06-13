# Project Structure

## Top-level relevant files

- [README.md](/home/varner/aprendizagem/projetos/react-dash/README.md:1)
  - short project summary and commands
- [package.json](/home/varner/aprendizagem/projetos/react-dash/package.json:1)
  - dependencies, scripts and package metadata
- [tsconfig.json](/home/varner/aprendizagem/projetos/react-dash/tsconfig.json:1)
  - TypeScript compiler behavior
- [vite.config.js](/home/varner/aprendizagem/projetos/react-dash/vite.config.js:1)
  - Vite and Vitest config
- [index.html](/home/varner/aprendizagem/projetos/react-dash/index.html:1)
  - Vite HTML entry
- [`.env.example`](/home/varner/aprendizagem/projetos/react-dash/.env.example:1)
  - documented environment variable names for demo auth data

## Source tree overview

### `src/`

Main application source folder.

### `src/main.tsx`

Application bootstrap. Mounts React and wraps providers.

### `src/App.tsx`

Root router and top-level protected/public route composition.

### `src/context/`

Global UI/application state providers.

- [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1)
- [src/context/darkModeContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/darkModeContext.tsx:1)
- [src/context/darkModeReducer.ts](/home/varner/aprendizagem/projetos/react-dash/src/context/darkModeReducer.ts:1)

### `src/config/`

Environment-backed frontend configuration.

- [src/config/auth.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/auth.ts:1)

### `src/components/`

Reusable building blocks.

#### `src/components/auth/`

Route guard components.

- `ProtectedRoute.tsx`
- `PublicOnlyRoute.tsx`

#### `src/components/layout/`

Shell composition.

- `DashboardLayout.tsx`

#### `src/components/sidebar/` and `src/components/navbar/`

Shared authenticated navigation and actions.

#### `src/components/widgets/`

KPI cards for home dashboard.

#### `src/components/featured/`

Summary card with circular progress and comparison values.

#### `src/components/chart/`

Revenue chart using Recharts.

#### `src/components/datatable/`

User listing grid with local delete behavior.

#### `src/components/table/`

Static transaction table.

### `src/pages/`

Route-level screens.

- `home/`: dashboard landing page
- `login/`: sign-in page
- `list/`: generic list page used by `/users` and `/products`
- `new/`: generic entry form page
- `single/`: entity profile/detail page
- `users/`: currently only a placeholder component, not wired into routes

### `src/datatablesource.tsx`

Mock table metadata and mocked user rows.

### `src/formSource.ts`

Form field metadata for user and product forms.

### `src/types.ts`

Shared TypeScript interfaces and types.

### `src/setupTests.ts`

Test setup file. Adds `jest-dom` and provides a `ResizeObserver` mock for JSDOM.

### `src/vite-env.d.ts`

Declares Vite environment variable names used by the frontend.

## Files and areas not present

### Confirmed absence

- No backend handlers or controllers
- No repositories or service classes
- No ORM models or migrations
- No API client abstraction layer
- No dedicated DTO/schema validation library usage
- No lint config file
- No formatter config file
- No CI pipeline file

## Practical navigation hints

- If a task involves auth, start in `src/context/authContext.tsx`, `src/config/auth.ts` and `src/pages/login/Login.tsx`.
- If a task involves theme behavior, start in `src/context/darkModeContext.tsx` and `src/style/dark.scss`.
- If a task involves navigation and route accessibility, inspect `src/App.tsx`, `src/components/auth/`, and `src/components/layout/`.
- If a task involves displayed business-like data, inspect `src/datatablesource.tsx`, `src/formSource.ts`, and the relevant component under `src/components/`.
