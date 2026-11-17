# React Expert Skills

These skills describe how an expert React agent should work in this project.
They are tool-agnostic and can be used by any AI assistant.

These are four work modes within the shared React guidance, not separate
subagent definitions. Choose the smallest applicable mode and read only its
relevant files. The Codex expert skill routes here; keep detailed rules in
this document rather than copying them into tool-specific wrappers.

## Shared Rules

- Start with [AGENTS.md](../../AGENTS.md), the
  [project README](../../README.md) and the relevant mode below.
- Follow [coding conventions](../coding-conventions.md) for shared UI,
  utilities and context-owned types. Keep product policy in its owning feature.
- Follow the [validation policy](../testing.md#validation-policy) for every
  change. For Codex frontend implementation, use `$react-front-test-runner`
  before handoff; it executes that same policy.
- [Graphify](graphify-development.md) supports non-trivial code analysis;
  [external documentation retrieval](external-docs-rag.md) supports uncertain
  library behavior. Routine edits do not require external research.

## React Dashboard Architect

Use for changes to route structure, page composition, shell layout, dashboard
state ownership or component boundaries.

Read first:

- `docs/agentic/graphify-development.md`
- `docs/agentic/external-docs-rag.md`
- `src/routes/AppRoutes.tsx`
- `src/components/layout/DashboardLayout.tsx`
- `src/pages/home/Home.tsx`
- `src/pages/home/components/`
- `docs/architecture.md`

Expert rules:

- Use Graphify before broad component or route refactors to identify hubs and
  affected symbols.
- Use the external docs RAG workflow before changing library configuration or
  relying on uncertain React/MUI/Vite behavior.
- Keep the current route tree simple unless the task explicitly asks for
  dedicated pages.
- Avoid pushing analytics business logic into presentational components.
- Keep interfaces, aliases and props in one `<context>.types.ts` file per
  context; follow [coding conventions](../coding-conventions.md).
- Extract orchestration from `Home` only when it reduces real complexity.
- Preserve protected route behavior and demo login flow.
- Keep component props shaped around prepared view data, not raw API payloads.

## React Analytics UI Specialist

Use for KPI cards, charts, tables, empty states, loading states, error states,
exports and responsive dashboard layout.

Read first:

- `docs/agentic/graphify-development.md`
- `docs/agentic/external-docs-rag.md`
- `src/pages/home/Home.tsx`
- `src/pages/home/components/`
- `src/pages/home/home.scss`
- `src/i18n/locales/pt-BR/home.json`
- `docs/localization.md`
- `src/analytics/transformers.ts`

Expert rules:

- Use Graphify to confirm whether a requested UI change touches only Home
  components or also `src/analytics`.
- Retrieve MUI, Recharts or browser docs when behavior depends on library
  internals, chart rendering or export APIs.
- Render analytics sections from transformer output.
- Keep fixture mode visually credible; never label fixture values as production
  facts.
- Make loading, API failure and empty analytics states visible without breaking
  the page.
- Use stable dimensions for charts, controls and tables to reduce layout shift.
- Use `rem` as the default frontend unit for new spacing, sizing, borders,
  radii and breakpoints; avoid introducing `px` unless a browser/library API
  explicitly requires pixel values. Mark intentional exceptions with `px-ok`
  and a short reason; validation is defined in the shared policy.
- Prefer MUI controls for forms, buttons, panels and table surfaces.

## React Test Engineer

Use for Vitest, Testing Library, Playwright and regression coverage.

Read first:

- `docs/agentic/graphify-development.md`
- `docs/agentic/external-docs-rag.md`
- `src/App.test.tsx`
- `src/analytics/*.test.ts`
- `tests/e2e/`
- `playwright.config.ts`
- `docs/testing.md`

Expert rules:

- Use Vitest for pure functions, API-client behavior and component smoke tests.
- Use Playwright for protected-route flows and user-visible dashboard behavior.
- Retrieve official Playwright/Vitest docs before changing test runner config,
  retries, traces, reporters, browser projects or test discovery.
- Keep E2E tests deterministic by using the local fixture path by default.
- Avoid requiring the Sales API for baseline E2E tests.
- Prefer role, label and accessible-name selectors over fragile CSS selectors.

## React Security Boundary Reviewer

Use when a change touches authentication, API keys, localStorage, environment
variables, AI/provider configuration or browser downloads.

Read first:

- `src/context/authContext.tsx`
- `src/config/auth.ts`
- `src/config/salesApi.ts`
- `src/analytics/api.ts`
- `src/analytics/exporters.ts`
- `.env.example`

Expert rules:

- Treat all `VITE_*` variables as public.
- Do not put OpenAI, provider or model API keys in the React app.
- Keep Sales API keys in memory only; never persist them or bundle them with
  the application.
- Persist only non-secret filter/configuration values.
- Keep downloads browser-side and generated from active dashboard data.
