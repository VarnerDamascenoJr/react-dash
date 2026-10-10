---
name: react-dash-react-expert
description: Apply React dashboard architecture, analytics UI, testing, and browser security guidance for react-dash changes involving routes, dashboard components, analytics views, tests, auth, API keys, exports, or frontend configuration.
---

# React Dash React Expert

Use this skill for React work in `react-dash`, especially when a task touches
route structure, page composition, dashboard state, Home components, analytics
UI, Vitest, Playwright, authentication, API keys, `VITE_*` configuration, or
browser downloads.

## Project Context

- This is a frontend-only React 18, TypeScript, Vite, MUI, MUI Data Grid,
  Recharts, Sass, Vitest, and Playwright app.
- The active product is the Sales Event analytics dashboard based on the
  `sales-analytics-export.v1` contract.
- Keep fixture-first behavior unless the user explicitly asks to change it.
- Keep `src/analytics` as the active domain boundary for contract types,
  fixture loading, API access, transformers, and exporters.
- Treat legacy users/products/new/single code as inactive unless a task
  explicitly brings it back into scope.

## Routing

Choose the smallest mode that fits the task:

- Architecture: route structure, page composition, shell layout, dashboard state
  ownership, or component boundaries.
- Analytics UI: KPI cards, charts, tables, empty states, loading states, error
  states, exports, and responsive dashboard layout.
- Testing: Vitest, Testing Library, Playwright, and regression coverage.
- Security boundary: authentication, API keys, localStorage, environment
  variables, AI/provider configuration, or browser downloads.

## Read First

Always start with `AGENTS.md`, `README.md`, and
`docs/agentic/react-expert-skills.md`.

For architecture changes, also read:

- `docs/agentic/graphify-development.md`
- `docs/agentic/external-docs-rag.md`
- `src/routes/AppRoutes.tsx`
- `src/components/layout/DashboardLayout.tsx`
- `src/pages/home/Home.tsx`
- `docs/architecture.md`

For analytics UI changes, also read:

- `docs/agentic/graphify-development.md`
- `docs/agentic/external-docs-rag.md`
- `src/pages/home/Home.tsx`
- `src/pages/home/components/`
- `src/pages/home/home.scss`
- `src/pages/home/copy.ts`
- `src/analytics/transformers.ts`

For testing changes, also read:

- `docs/agentic/graphify-development.md`
- `docs/agentic/external-docs-rag.md`
- `src/App.test.tsx`
- `src/analytics/*.test.ts`
- `tests/e2e/`
- `playwright.config.ts`
- `docs/testing.md`

For security-boundary changes, also read:

- `src/context/authContext.tsx`
- `src/config/auth.ts`
- `src/config/salesApi.ts`
- `src/analytics/api.ts`
- `src/analytics/exporters.ts`
- `.env.example`

## Working Rules

- Use Graphify before broad component, route, contract-impact, or ownership
  refactors, then verify conclusions in source before editing.
- Use the external docs RAG workflow before changing library configuration or
  relying on uncertain React, MUI, Vite, Recharts, Vitest, or Playwright
  behavior.
- Prefer the local library RAG CLI for quick docs lookup:
  `npm run rag:sources`, `npm run rag:fetch`, and `npm run rag:query`.
- Keep the current route tree simple unless the task explicitly asks for
  dedicated pages.
- Keep analytics business logic out of presentational components.
- Extract orchestration from `Home` only when it reduces real complexity.
- Preserve protected route behavior and demo login flow.
- Shape component props around prepared view data instead of raw API payloads.
- Render analytics sections from transformer output.
- Keep fixture mode visually credible; do not label fixture values as
  production facts.
- Make loading, API failure, and empty analytics states visible without
  breaking the page.
- Use stable dimensions for charts, controls, and tables to reduce layout shift.
- Use `rem` as the default frontend unit for new spacing, sizing, borders,
  radii, and breakpoints. Use `px` only when a browser or library API requires
  pixels, and mark intentional exceptions according to the project style check.
- Prefer MUI controls for forms, buttons, panels, and table surfaces.
- Treat all `VITE_*` values as browser-visible.
- Do not put OpenAI, provider, model, or Sales API secrets in the React app.
- Keep Sales API keys in memory only.
- Persist only non-secret filters and configuration.
- Generate downloads browser-side from active dashboard data.

## Validation

For every React frontend implementation task, also use
`$react-front-test-runner` before the final response.

For code changes, run the checks that match the touched surface:

```bash
npm test
npm run typecheck
npm run check:style-units
npm run build
npm run test:e2e
git diff --check
```

For documentation-only changes, run:

```bash
git diff --check
```
