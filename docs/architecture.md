# Architecture

## Identification

### Confirmed facts

- Language: TypeScript for application source.
- Runtime: browser runtime for the app; Node.js runtime for build and test tooling.
- Framework/library: React 18.
- Router: `react-router-dom`.
- Build tool: Vite.
- Test runner: Vitest.
- Styling: Sass plus component/page SCSS files.
- Component libraries: MUI, MUI Data Grid, Recharts, `react-circular-progressbar`.
- Package manager in use: npm, confirmed by [package-lock.json](/home/varner/aprendizagem/projetos/react-dash/package-lock.json:1).
- Application type: client-side SPA dashboard.

### Confirmed configuration sources

- [package.json](/home/varner/aprendizagem/projetos/react-dash/package.json:1)
- [tsconfig.json](/home/varner/aprendizagem/projetos/react-dash/tsconfig.json:1)
- [vite.config.js](/home/varner/aprendizagem/projetos/react-dash/vite.config.js:1)
- [src/main.tsx](/home/varner/aprendizagem/projetos/react-dash/src/main.tsx:1)
- [src/App.tsx](/home/varner/aprendizagem/projetos/react-dash/src/App.tsx:1)

## Architectural Style

### Confirmed

- The repository follows a route/page/component organization typical of small and medium React SPAs.
- There is no evidence of server-side rendering.
- There is no evidence of backend-for-frontend logic inside the repository.
- State management is intentionally lightweight:
  - `AuthContext` for authentication session
  - `DarkModeContext` for theme state
- Page components orchestrate reusable presentational components and mock data sources.

### Inference

- The dominant style is “component-driven frontend with route-level composition,” not a formally layered architecture such as Clean or Hexagonal.
- The codebase is small enough that boundaries are conceptual rather than enforced by modules or packages.

## Entrypoints And Flow

### Bootstrapping

- [src/main.tsx](/home/varner/aprendizagem/projetos/react-dash/src/main.tsx:1) mounts the React tree.
- Providers are composed in this order:
  1. `AuthContextProvider`
  2. `DarkModeContextProvider`
  3. `App`

### Routing

- [src/App.tsx](/home/varner/aprendizagem/projetos/react-dash/src/App.tsx:1) contains the entire route tree.
- Public route:
  - `/login`
- Protected routes:
  - `/`
  - `/users`
  - `/users/:userId`
  - `/users/new`
  - `/products`
  - `/products/:productId`
  - `/products/new`

### Layout composition

- [src/components/layout/DashboardLayout.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/layout/DashboardLayout.tsx:1) provides the authenticated shell.
- Shared layout parts:
  - [src/components/sidebar/Sidebar.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/sidebar/Sidebar.tsx:1)
  - [src/components/navbar/Navbar.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/navbar/Navbar.tsx:1)

### Non-routed source still present

- [src/pages/users/Users.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/users/Users.tsx:1) exists as a placeholder component but is not referenced by the route tree in `App.tsx`.

## Responsibility Split

### Contexts

- `AuthContext`:
  - stores current user in state
  - hydrates from `localStorage`
  - exposes `login` and `logout`
- `DarkModeContext`:
  - stores `darkMode` boolean
  - updates through reducer actions

### Pages

- Pages are responsible for arranging sections and selecting reusable components.
- They do not currently encapsulate real API orchestration.

### Reusable components

- Widgets, chart, featured card, table and data grid are presentation-focused.
- `Datatable` holds one local interactive behavior: removing a row from local state.

## Internal Dependencies

### Important dependencies between source areas

- `App` depends on contexts and route guard components.
- `Login` depends on `AuthContext`.
- `ProtectedRoute` and `PublicOnlyRoute` depend on `AuthContext`.
- `Sidebar` and `Navbar` depend on both `AuthContext` and `DarkModeContext`.
- `Datatable` depends on `datatablesource.tsx`.
- `New` depends on `formSource.ts`.

## Coupling Points

### Confirmed coupling

- Route definitions are centralized in `App.tsx`.
- Demo authentication is coupled to environment-backed values in [src/config/auth.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/auth.ts:1).
- Display data is tightly coupled to hardcoded mock arrays.
- Theme state is coupled to CSS variable overrides in [src/style/dark.scss](/home/varner/aprendizagem/projetos/react-dash/src/style/dark.scss:1).

### Risks from current coupling

- Replacing mock data with real API data will require changes in multiple components.
- Auth behavior is not abstracted behind a service layer; swapping demo auth for real auth will affect context and login page.

## Asynchrony

### Confirmed

- The only explicit async behavior in the app code is the delayed login promise in `AuthContext.login`.
- No network calls are present.
- No message queues, event buses or background jobs are present.

## Cloud / Infrastructure

### Confirmed absence

- No Dockerfile.
- No docker-compose file.
- No Terraform, CloudFormation or Serverless configuration.
- No CI/CD workflow files were identified in tracked project files.

### Unknown

- Actual deployment target is not documented in the repository.
