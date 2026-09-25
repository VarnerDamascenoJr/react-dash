# Integrations

## Overview

## Confirmed external integrations

The project has an optional local HTTP integration with the
`sales-event-project` analytics export API. The dashboard still works without
that API by using a versioned local fixture.

What it does integrate with are frontend libraries and browser/platform capabilities.

## HTTP integrations

### Sales analytics export API

- Purpose: load operational analytics data from `sales-event-project`
- Client module: [src/analytics/api.ts](/home/varner/aprendizagem/projetos/react-dash/src/analytics/api.ts:1)
- Configuration module: [src/config/salesApi.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/salesApi.ts:1)
- Default frontend base URL: `/api`
- Vite proxy target: `http://localhost:8080`
- Endpoint path:

```text
GET /analytics/export?salesEventId=&start=&end=&limit=
```

- Authentication model:
  - browser client sends `X-API-Key` when provided in the dashboard UI
  - API key values must not be committed to repo files
  - API key values are not persisted in `localStorage`
- Expected backend roles:
  - `SUPPORT`
  - `ADMIN`
- Expected schema:
  - `sales-analytics-export.v1`
- Failure handling:
  - invalid filters, missing API key, forbidden role and network failures become user-facing messages
  - the dashboard falls back to `src/analytics/fixtures/sales-analytics-export.v1.json`
  - invalid response schema is rejected before updating the document

## Browser/platform integrations

### `localStorage`

- Purpose: persist demo authenticated user session and non-secret analytics
  source filters
- Modules:
  - [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1)
  - [src/pages/home/Home.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/home/Home.tsx:1)
- Protocol/API: browser Web Storage API
- Authentication model: not applicable
- Failure handling:
  - analytics filters fall back to in-memory defaults if storage is unavailable
  - demo auth may require a fresh login if storage is unavailable
- Impact if unavailable:
  - login persistence would fail or become unreliable
  - analytics `Base URL`, `Sales event`, `Start`, `End` and `Limite` would
    reset to defaults between page loads

### `URL.createObjectURL`

- Purpose: preview uploaded file on the “new” page and download generated
  JSON/CSV/PNG exports
- Module: [src/pages/new/New.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/new/New.tsx:1)
  and [src/analytics/exporters.ts](/home/varner/aprendizagem/projetos/react-dash/src/analytics/exporters.ts:1)
- Protocol/API: browser File/Object URL API
- Failure handling:
  - upload preview has no explicit try/catch
  - chart PNG export surfaces an error message when an SVG/canvas step fails
- Impact if unavailable:
  - image preview and browser-side export downloads would not function

## UI library integrations

### MUI Core

- Purpose: reusable material UI components, especially table primitives
- Modules:
  - [src/components/table/Table.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/table/Table.tsx:1)
- Impact if broken:
  - transaction table rendering fails or degrades

### MUI Data Grid

- Purpose: tabular grid rendering for analytics events and legacy list
  components
- Module:
  - [src/pages/home/Home.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/home/Home.tsx:1)
  - [src/components/datatable/Datatable.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/datatable/Datatable.tsx:1)
- Impact if broken:
  - analytics event exploration fails or degrades

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
- `VITE_SALES_API_BASE_URL`

### Source

- [src/config/auth.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/auth.ts:1)
- [src/config/salesApi.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/salesApi.ts:1)
- [src/vite-env.d.ts](/home/varner/aprendizagem/projetos/react-dash/src/vite-env.d.ts:1)

### Purpose

- Configure demo login identity, demo profile display and Sales API base URL.

### Important note

- These are environment variables for demo behavior, not evidence of a production secret-management strategy.
- Documentation and agent guidance should refer to variable names, not example values.

## Confirmed non-integrations

- No HTTP client library usage was identified.
- No GraphQL or gRPC API integration was identified.
- No message broker or queue integration was identified.
- No observability vendor integration was identified.
- No payment, email, notification or storage service SDK usage was identified.

## Unknowns

- The repository does not document how these variables are supplied outside local development.
