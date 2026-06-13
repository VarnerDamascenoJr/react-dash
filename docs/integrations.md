# Integrations

## Overview

## Confirmed external integrations

The project has no real backend API or infrastructure integration in the application source.

What it does integrate with are frontend libraries and browser/platform capabilities.

## Browser/platform integrations

### `localStorage`

- Purpose: persist demo authenticated user session
- Module: [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1)
- Protocol/API: browser Web Storage API
- Authentication model: not applicable
- Failure handling:
  - no explicit fallback if storage is unavailable
- Impact if unavailable:
  - login persistence would fail or become unreliable

### `URL.createObjectURL`

- Purpose: preview uploaded file on the “new” page
- Module: [src/pages/new/New.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/new/New.tsx:1)
- Protocol/API: browser File/Object URL API
- Failure handling:
  - no explicit try/catch
- Impact if unavailable:
  - image preview would not function

## UI library integrations

### MUI Core

- Purpose: reusable material UI components, especially table primitives
- Modules:
  - [src/components/table/Table.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/table/Table.tsx:1)
- Impact if broken:
  - transaction table rendering fails or degrades

### MUI Data Grid

- Purpose: tabular grid rendering for user list
- Module:
  - [src/components/datatable/Datatable.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/datatable/Datatable.tsx:1)
- Impact if broken:
  - `/users` and `/products` list experience breaks significantly

### Recharts

- Purpose: chart rendering
- Module:
  - [src/components/chart/Chart.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/chart/Chart.tsx:1)
- Error behavior observed:
  - tests emit a width/height warning in JSDOM
- Impact if broken:
  - dashboard visualization sections fail

### `react-circular-progressbar`

- Purpose: circular KPI summary
- Module:
  - [src/components/featured/Feature.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/featured/Feature.tsx:1)

## Environment-backed configuration

### Confirmed variable names

- `VITE_DEMO_LOGIN_EMAIL`
- `VITE_DEMO_LOGIN_PASSWORD`
- `VITE_DEMO_USER_NAME`
- `VITE_DEMO_USER_ROLE`
- `VITE_DEMO_USER_AVATAR`

### Source

- [src/config/auth.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/auth.ts:1)
- [src/vite-env.d.ts](/home/varner/aprendizagem/projetos/react-dash/src/vite-env.d.ts:1)

### Purpose

- Configure demo login identity and demo profile display.

### Important note

- These are environment variables for demo behavior, not evidence of a production secret-management strategy.
- Documentation and agent guidance should refer to variable names, not example values.

## Confirmed non-integrations

- No HTTP client library usage was identified.
- No REST, GraphQL or gRPC API integration was identified.
- No message broker or queue integration was identified.
- No observability vendor integration was identified.
- No payment, email, notification or storage service SDK usage was identified.

## Unknowns

- The repository does not document how these variables are supplied outside local development.
