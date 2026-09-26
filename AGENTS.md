# AGENTS.md

Ponto de entrada agnostico para qualquer agente de IA trabalhando neste
repositorio. Nao depende de Codex, Cursor, Claude, Copilot, Devin ou outra
ferramenta especifica.

## Project Snapshot

- SPA frontend-only com React 18, TypeScript, Vite, MUI, MUI Data Grid,
  Recharts, Sass e Playwright.
- Produto atual: dashboard analitico do Sales Event baseado no contrato
  `sales-analytics-export.v1`.
- Rota ativa principal: `/`, protegida por login demo client-side.
- Rota publica: `/login`.
- A Home carrega fixture local por padrao e pode buscar
  `GET /analytics/export` no `sales-event-project`.
- Nao ha backend, ORM, migrations ou persistencia server-side neste repositorio.

## First Files To Read

1. [README.md](/home/varner/aprendizagem/projetos/react-dash/README.md:1)
2. [docs/agentic/README.md](/home/varner/aprendizagem/projetos/react-dash/docs/agentic/README.md:1)
3. [docs/agentic/react-expert-skills.md](/home/varner/aprendizagem/projetos/react-dash/docs/agentic/react-expert-skills.md:1)
4. [docs/agentic/graphify-development.md](/home/varner/aprendizagem/projetos/react-dash/docs/agentic/graphify-development.md:1)
5. [docs/agentic/external-docs-rag.md](/home/varner/aprendizagem/projetos/react-dash/docs/agentic/external-docs-rag.md:1)
6. [docs/analytics-dashboard-backlog.md](/home/varner/aprendizagem/projetos/react-dash/docs/analytics-dashboard-backlog.md:1)
7. [src/pages/home/Home.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/home/Home.tsx:1)
8. [src/analytics/index.ts](/home/varner/aprendizagem/projetos/react-dash/src/analytics/index.ts:1)
9. [playwright.config.ts](/home/varner/aprendizagem/projetos/react-dash/playwright.config.ts:1)

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
- `src/pages/home/Home.tsx` is the main orchestration hub for loading,
  persistence of non-secret filters, data derivation and exports.
- Sidebar entries for Eventos, Funil, Sobrevivencia, Exportacoes and
  Configuracao are domain navigation labels, but only `/` is currently routed.
- Legacy components for users/products/new/single still exist but are not wired
  into the active route tree.

## Validation

For code changes:

```bash
npm test
npm run typecheck
npm run build
npm run test:e2e
git diff --check
```

For documentation-only changes:

```bash
git diff --check
```

Known warnings:

- `npm run build` may warn about a large bundle.
- `npm test` can emit Recharts size warnings in JSDOM.

## Agentic Operating Model

- React expert skills live in
  [docs/agentic/react-expert-skills.md](/home/varner/aprendizagem/projetos/react-dash/docs/agentic/react-expert-skills.md:1).
- Graphify development flow lives in
  [docs/agentic/graphify-development.md](/home/varner/aprendizagem/projetos/react-dash/docs/agentic/graphify-development.md:1).
- External documentation retrieval lives in
  [docs/agentic/external-docs-rag.md](/home/varner/aprendizagem/projetos/react-dash/docs/agentic/external-docs-rag.md:1).
- Use Graphify before broad refactors or contract-impact analysis, but verify
  conclusions in source before editing.
