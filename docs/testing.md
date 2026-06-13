# Testing

## Tooling

### Confirmed

- Test runner: Vitest
- DOM environment: JSDOM
- Assertion helpers: `@testing-library/jest-dom`
- Rendering utilities: `@testing-library/react`

### Evidence

- [package.json](/home/varner/aprendizagem/projetos/react-dash/package.json:1)
- [vite.config.js](/home/varner/aprendizagem/projetos/react-dash/vite.config.js:1)
- [src/setupTests.ts](/home/varner/aprendizagem/projetos/react-dash/src/setupTests.ts:1)

## Test organization

### Confirmed files

- [src/App.test.tsx](/home/varner/aprendizagem/projetos/react-dash/src/App.test.tsx:1)
- [src/pages/new/New.test.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/new/New.test.tsx:1)

### Pattern

- Tests live next to or near source under `src/`.
- Current test style is component-level rendering assertions.

## Current coverage shape

### Confirmed covered areas

- Root app render under authenticated state
- `New` page form field rendering

### Confirmed uncovered or weakly covered areas

- Login success and failure behavior
- Route guard redirect behavior
- Logout behavior
- Theme switching behavior
- Datatable delete interaction
- Layout responsiveness
- Product flow behavior
- Single page content behavior
- Accessibility behavior

## Mocks and setup

### Confirmed

- `ResizeObserver` is mocked globally for test environment compatibility.
- `App.test.tsx` seeds `localStorage` with a serialized demo user before rendering.
- `New.test.tsx` uses `MemoryRouter` only where routing support is required.

### Evidence

- [src/setupTests.ts](/home/varner/aprendizagem/projetos/react-dash/src/setupTests.ts:1)
- [src/App.test.tsx](/home/varner/aprendizagem/projetos/react-dash/src/App.test.tsx:1)
- [src/pages/new/New.test.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/new/New.test.tsx:1)

## Commands

### Confirmed

- Full suite: `npm test`
- Type checking: `npm run typecheck`
- Build validation: `npm run build`

### Not configured in repository

- No lint script is present in `package.json`.
- No coverage script is present in `package.json`.
- No per-file helper script is defined for running a single test target.

## Executed validation for this analysis

### Confirmed results during analysis

- `npm run typecheck`: passed
- `npm run build`: passed
- `npm test`: passed

### Observed warning

- `App.test.tsx` produces a Recharts warning in JSDOM:
  - chart container width and height resolve to 0 in test environment
  - tests still pass

## Guidance for future tests

### Follow observed patterns

- Wrap components with the same providers used at runtime when the component depends on context.
- Seed `localStorage` when auth state must exist.
- Use `MemoryRouter` for route-aware component rendering when full `App` render is unnecessary.

### Recommended future targets based on current risk

- Login error messaging
- Protected route redirects
- Logout flow
- Datatable local deletion
- Dark mode toggling
- Form image upload preview
