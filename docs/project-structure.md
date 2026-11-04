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

Application shell. Applies global theme class and mounts the browser router.

### `src/routes/`

Route tree composition for public and protected areas.

- [src/routes/AppRoutes.tsx](/home/varner/aprendizagem/projetos/react-dash/src/routes/AppRoutes.tsx:1)

### `src/context/`

Global UI/application state providers.

- [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1)
- [src/context/darkModeContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/darkModeContext.tsx:1)
- [src/context/darkModeReducer.ts](/home/varner/aprendizagem/projetos/react-dash/src/context/darkModeReducer.ts:1)

### `src/config/`

Environment-backed frontend configuration.

- [src/config/auth.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/auth.ts:1)
- [src/config/salesApi.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/salesApi.ts:1)

### `src/components/`

Reusable building blocks.

#### `src/components/common/`

Shared UI grouped by responsibility. Each directory owns its components,
context types, styles and existing tests:

- `branding/`: brand identity.
- `controls/`: language selector and labeled icon buttons.
- `feedback/`: empty states.
- `layout/`: page introductions and section panels.
- `data-display/`: metric lists.
- `charts/`: generic chart rendering and chart containers.

Consumers import directly from the component file in its context directory.
See [reusability.md](reusability.md) for the component and type inventory.

#### `src/components/auth/`

Route guard components.

- `ProtectedRoute.tsx`
- `PublicOnlyRoute.tsx`

#### `src/components/layout/`

Shell composition.

- `DashboardLayout.tsx`

#### `src/components/sidebar/` and `src/components/navbar/`

Shared authenticated navigation and actions.

- `src/components/sidebar/SidebarNavSection.tsx`: reusable sidebar section and item renderer

#### `src/components/widgets/`

Legacy KPI cards; the active overview uses its own `KpiGrid` section.

#### `src/components/featured/`

Summary card with circular progress and comparison values.

#### `src/components/chart/`

Legacy revenue chart using Recharts. The active analytics overview uses chart
components under `src/components/common/charts/`.

#### `src/components/datatable/`

User listing grid with local delete behavior.

#### `src/components/table/`

Static transaction table.

### `src/pages/`

Route-level screens.

- `home/`: dashboard landing page
  - `components/`: sections used only by the analytics overview
  - `useAnalyticsFormatters.ts`: binds the active locale to shared formatters
- `login/`: sign-in page
- `list/`: legacy generic list page, not wired into the current route tree
- `new/`: legacy generic entry form page, not wired into the current route tree
- `single/`: legacy entity profile/detail page, not wired into the current route tree
- `users/`: currently only a placeholder component, not wired into routes

### `src/datatablesource.tsx`

Legacy mock table metadata and mocked user rows for non-routed user/product
components.

### `src/utils/`

Global functions for locale formatting, CSV serialization, browser downloads
and optional preference storage. See [reusability.md](reusability.md) for the
inventory and context boundaries.

### `src/formSource.ts`

Form field metadata for user and product forms.

### Type contracts

Shared types live with their owning area: `src/auth/auth.types.ts`,
`src/context/darkMode.types.ts`, `src/config/salesApi.types.ts` and
`src/analytics/analytics.types.ts`. Home props live in `src/pages/home/home.types.ts`; legacy form
and table types stay with those features. See [type-organization.md](type-organization.md).

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
- No formatter config file
- No CI pipeline file

## Practical navigation hints

- If a task involves auth, start in `src/context/authContext.tsx`, `src/config/auth.ts` and `src/pages/login/Login.tsx`.
- If a task involves theme behavior, start in `src/context/darkModeContext.tsx` and `src/style/dark.scss`.
- If a task involves navigation and route accessibility, inspect `src/App.tsx`, `src/components/auth/`, and `src/components/layout/`.
- If a task involves displayed business-like data, inspect `src/datatablesource.tsx`, `src/formSource.ts`, and the relevant component under `src/components/`.
