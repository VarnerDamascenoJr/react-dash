# AGENTS.md

## Project Snapshot

- Frontend-only React 18 dashboard built with TypeScript and Vite.
- Main runtime pattern: client-side SPA with route-level pages, reusable UI components and lightweight React Context state.
- There is no backend, ORM, migration system or server-side persistence in this repository.
- Auth is demo-only and client-side, persisted in browser `localStorage`.
- Most displayed business-like data is mock data from source files.

## First Files To Read

- [README.md](/home/varner/aprendizagem/projetos/react-dash/README.md:1)
- [package.json](/home/varner/aprendizagem/projetos/react-dash/package.json:1)
- [src/main.tsx](/home/varner/aprendizagem/projetos/react-dash/src/main.tsx:1)
- [src/App.tsx](/home/varner/aprendizagem/projetos/react-dash/src/App.tsx:1)
- [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1)
- [src/context/darkModeContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/darkModeContext.tsx:1)
- [src/config/auth.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/auth.ts:1)

## Work Safely

- Treat the app as a demo UI unless a task explicitly introduces real integrations.
- Do not describe mock values as confirmed business rules.
- Do not add secrets or credentials to tracked files.
- Remember that auth checks are client-side only and not production-grade security.
- Validate relevant changes with `npm run typecheck`, `npm run build` and `npm test`.

## Important Realities

- Protected routes: `/`, `/users`, `/users/:userId`, `/users/new`, `/products`, `/products/:productId`, `/products/new`
- Public route: `/login`
- Session storage key: `react-dash.auth.user`
- Mock data sources:
  - [src/datatablesource.tsx](/home/varner/aprendizagem/projetos/react-dash/src/datatablesource.tsx:1)
  - [src/formSource.ts](/home/varner/aprendizagem/projetos/react-dash/src/formSource.ts:1)
- Environment variable names are declared in [src/vite-env.d.ts](/home/varner/aprendizagem/projetos/react-dash/src/vite-env.d.ts:1)

## Known Risks

- Demo auth can be bypassed by tampering with client state.
- Most UI actions do not persist beyond local component state.
- `Datatable` uses a hardcoded `/users/test` view route.
- `npm run build` completes with a large bundle warning.
- `npm test` passes, but `App.test.tsx` emits a Recharts size warning in JSDOM.

## More Detail

- [docs/architecture.md](/home/varner/aprendizagem/projetos/react-dash/docs/architecture.md:1)
- [docs/project-structure.md](/home/varner/aprendizagem/projetos/react-dash/docs/project-structure.md:1)
- [docs/domain.md](/home/varner/aprendizagem/projetos/react-dash/docs/domain.md:1)
- [docs/flows.md](/home/varner/aprendizagem/projetos/react-dash/docs/flows.md:1)
- [docs/database.md](/home/varner/aprendizagem/projetos/react-dash/docs/database.md:1)
- [docs/integrations.md](/home/varner/aprendizagem/projetos/react-dash/docs/integrations.md:1)
- [docs/testing.md](/home/varner/aprendizagem/projetos/react-dash/docs/testing.md:1)
- [docs/troubleshooting.md](/home/varner/aprendizagem/projetos/react-dash/docs/troubleshooting.md:1)
