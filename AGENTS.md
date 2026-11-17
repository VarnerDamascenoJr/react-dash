# AGENTS.md

Tool-agnostic entry point for any AI agent working in this repository.
It does not depend on Codex, Cursor, Claude, Copilot, Devin or any other
specific tool.

## Project Snapshot

- Frontend-only SPA using React 18, TypeScript, Vite, MUI, MUI Data Grid,
  Recharts, Sass and Playwright.
- Current product: Sales Event analytics dashboard based on the
  `sales-analytics-export.v1` contract.
- Main active route: `/`, protected by a client-side demo login.
- Public route: `/login`.
- Home loads a local fixture by default and can fetch data from
  `GET /analytics/export` in `sales-event-project`.
- This repository has no backend, ORM, migrations or server-side persistence.

## First Files To Read

1. [README.md](README.md)
2. [docs/README.md](docs/README.md) to choose the documents relevant to the task.
3. [docs/agentic/README.md](docs/agentic/README.md) for agent workflows.

Read the relevant React expert mode, Graphify or external-docs workflow when
the task calls for it. Consult the active backlog when planning work; archived
plans are historical context, not current instructions.

## Work Safely

- Do not add secrets, API keys or credentials to tracked files.
- Treat all `VITE_*` values as browser-visible.
- Keep provider/model secrets out of the React bundle.
- Preserve fixture-first behavior unless the task explicitly changes it.
- Keep the Sales API path optional and fallback-safe.
- Do not present legacy users/products mock data as the active product domain.
- Do not commit Graphify generated graphs, logs, metadata, hooks or config.
- Use the external docs RAG workflow when local context is insufficient or when
  library best practices may have changed.
- Avoid destructive git operations unless the user explicitly asks for them.

## Current Product Reality

- `src/analytics` is the active domain boundary:
  - types for `sales-analytics-export.v1`
  - local fixture
  - API client and fallback
  - pure transformers
  - JSON/CSV/PNG exporters
- `src/pages/home/Home.tsx` composes the loading/settings and export hooks,
  memoized data transformations and presentational analytics sections.
- Sidebar entries for Eventos, Funil, Sobrevivencia, Exportacoes and
  Configuracao are domain navigation labels, but only `/` is currently routed.
- Legacy components for users/products/new/single still exist but are not wired
  into the active route tree.

## Validation

Follow the [validation policy](docs/testing.md#validation-policy) for every
change. It owns the required checks, additional checks by change type, failure
reporting and known warnings. Skills and other documents refer to that policy
instead of maintaining separate command lists.

## Agentic Operating Model

- Codex-specific React expert skill lives in
  [.agents/skills/react-dash-expert/SKILL.md](.agents/skills/react-dash-expert/SKILL.md).
- Use `$react-dash-expert` for React work that touches routes,
  dashboard components, analytics views, tests, auth, API keys, exports or
  frontend configuration.
- Frontend validation skill lives in
  [.agents/skills/react-front-test-runner/SKILL.md](.agents/skills/react-front-test-runner/SKILL.md).
- Use `$react-front-test-runner` after every React frontend implementation
  task before handing off.
- React expert skills live in
  [docs/agentic/react-expert-skills.md](docs/agentic/react-expert-skills.md).
- Graphify development flow lives in
  [docs/agentic/graphify-development.md](docs/agentic/graphify-development.md).
- External documentation retrieval lives in
  [docs/agentic/external-docs-rag.md](docs/agentic/external-docs-rag.md).
- Use Graphify before broad refactors or contract-impact analysis, but verify
  conclusions in source before editing.
