# Troubleshooting

## General

This project is a frontend-only React/Vite dashboard with demo auth and mock data. Many apparent “business problems” can actually be mock-data or client-state limitations rather than server bugs.

## Common situations

### I cannot access dashboard routes

**Confirmed checks**

- Protected routes require an authenticated client session.
- If `AuthContext` reports `isAuthenticated = false`, routes redirect to `/login`.

**Inspect**

- [src/components/auth/ProtectedRoute.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/auth/ProtectedRoute.tsx:1)
- [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1)
- [src/config/auth.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/auth.ts:1)

**Likely causes**

- `localStorage` does not contain the demo user
- entered credentials do not match demo configuration
- environment variables changed demo values unexpectedly

### Login page redirects away immediately

**Confirmed cause**

- `PublicOnlyRoute` redirects authenticated users from `/login` to `/`.

**Inspect**

- [src/components/auth/PublicOnlyRoute.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/auth/PublicOnlyRoute.tsx:1)

### Delete in users grid does not persist

**Confirmed cause**

- Delete only mutates React local state in `Datatable`.

**Inspect**

- [src/components/datatable/Datatable.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/datatable/Datatable.tsx:1)

### Form submit does nothing

**Confirmed cause**

- `New` page renders a form UI but no persistence or explicit React submit handler is implemented.

**Inspect**

- [src/pages/new/New.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/new/New.tsx:1)

**Important detail**

- Because the form still uses the browser default submit behavior, you may see a page reload or same-route submission behavior instead of a saved record.

### Tests warn about chart dimensions

**Confirmed cause**

- Recharts renders inside JSDOM without real layout dimensions.

**Evidence**

- Warning observed during `npm test`
- `ResizeObserver` is mocked in [src/setupTests.ts](/home/varner/aprendizagem/projetos/react-dash/src/setupTests.ts:1), but container sizing remains artificial

### Build warns about large chunks

**Confirmed cause**

- Vite build emits a large bundle warning.

**Observed during analysis**

- JS output exceeded the default 500 kB warning threshold after minification.

**Likely contributing factors**

- MUI
- Data Grid
- Recharts
- no route-level code splitting currently present

## Operational unknowns

- Deployment process is not documented in repository files.
- No CI pipeline is present, so local verification is especially important.

## Safe validation commands

- `npm run typecheck`
- `npm run build`
- `npm test`

These commands were executed during analysis and are non-destructive in the current repository context.
