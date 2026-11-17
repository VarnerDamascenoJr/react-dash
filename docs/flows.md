# Flows

## Overview

The most meaningful flows in the current repository are protected frontend
navigation, analytics fixture/API loading, browser-side exports and local UI
state. The app has no database transaction flow of its own, but it can call the
local `sales-event-project` analytics export API and falls back to the versioned
fixture when that API is unavailable.

## Flow 1: demo login and protected access

### Confirmed entry point

- [src/pages/login/Login.tsx](../src/pages/login/Login.tsx)

### Confirmed execution path

1. User opens `/login`.
2. Form state is initialized with demo credentials from [src/config/auth.ts](../src/config/auth.ts).
3. `useLoginForm.handleSubmit` checks native form validity, blocks duplicate
   pending submissions and calls `AuthContext.login`.
4. `AuthContext.login`:
   - normalizes email
   - waits 400 ms
   - compares email and password against demo config
5. On success:
   - writes `demoUser` to `localStorage`
   - updates React auth state
6. `getLoginRedirect` restores a valid protected pathname, query and fragment
   from route state. Malformed destinations, external paths and login loops
   fall back to `/`.
7. Protected routes become accessible.

### Confirmed initialization behavior

- On provider initialization, `AuthContextProvider` attempts to hydrate the authenticated user from `localStorage` before route guards run.

### Validations

- Email is normalized with `trim().toLowerCase()`.
- Password is trimmed before comparison.

### Error handling

- Invalid demo credentials throw `DemoAuthenticationError`.
- The form hook stores `invalidCredentials` or `authFailed` feedback codes;
  the UI translates them in the active language and allows retry after failure.
- Auth storage is still accessed directly; see the limitations in
  [browser persistence](integrations.md#browser-persistence).

### Persistence

- Browser `localStorage`, key: `react-dash.auth.user`

### External integration

- None

### Mermaid

```mermaid
flowchart TD
  A[User opens /login] --> B[Submit login form]
  B --> C[AuthContext.login]
  C --> D{Credentials match demo config?}
  D -- No --> E[Throw error]
  E --> F[Render error message]
  D -- Yes --> G[Persist demo user to localStorage]
  G --> H[Update auth state]
  H --> I[Redirect to protected route or /]
```

### Files involved

- [src/pages/login/Login.tsx](../src/pages/login/Login.tsx)
- [useLoginForm.ts](../src/pages/login/hooks/useLoginForm.ts)
- [loginRedirect.ts](../src/pages/login/loginRedirect.ts)
- [src/context/authContext.tsx](../src/context/authContext.tsx)
- [src/config/auth.ts](../src/config/auth.ts)
- [src/components/auth/ProtectedRoute.tsx](../src/components/auth/ProtectedRoute.tsx)
- [src/components/auth/PublicOnlyRoute.tsx](../src/components/auth/PublicOnlyRoute.tsx)

## Flow 2: route protection and shell rendering

### Confirmed entry point

- [src/App.tsx](../src/App.tsx)
- [src/routes/AppRoutes.tsx](../src/routes/AppRoutes.tsx)

### Confirmed execution path

1. App mounts router.
2. `/login` is wrapped by `PublicOnlyRoute`.
3. Internal dashboard routes are wrapped by `ProtectedRoute`.
4. When authorized, `DashboardLayout` renders:
   - `Sidebar`
   - `Navbar`
   - `Outlet`
5. The selected page is rendered in the content area.
6. `Sidebar` can force light or dark mode and can call `logout`.
7. `Navbar` can toggle theme and call `logout`.

### Error handling

- No explicit route-level error boundaries exist.

### External integration

- None

### Mermaid

```mermaid
flowchart TD
  A[Route request] --> B{Is /login?}
  B -- Yes --> C[PublicOnlyRoute]
  C --> D{Authenticated?}
  D -- Yes --> E[Redirect to /]
  D -- No --> F[Render login]
  B -- No --> G[ProtectedRoute]
  G --> H{Authenticated?}
  H -- No --> I[Redirect to /login]
  H -- Yes --> J[Render DashboardLayout]
  J --> K[Render page via Outlet]
```

### Files involved

- [src/App.tsx](../src/App.tsx)
- [src/routes/AppRoutes.tsx](../src/routes/AppRoutes.tsx)
- [src/components/auth/ProtectedRoute.tsx](../src/components/auth/ProtectedRoute.tsx)
- [src/components/auth/PublicOnlyRoute.tsx](../src/components/auth/PublicOnlyRoute.tsx)
- [src/components/layout/DashboardLayout.tsx](../src/components/layout/DashboardLayout.tsx)

## Flow 3: analytics fixture/API loading and fallback

### Confirmed entry point

- [src/pages/home/Home.tsx](../src/pages/home/Home.tsx)

### Confirmed execution path

1. `Home` composes `useSalesAnalytics`, which initializes the loaded document
   with `localSalesAnalyticsFixture`.
2. The hook loads persisted non-secret settings through
   [src/config/salesApi.ts](../src/config/salesApi.ts):
   - `baseUrl`
   - `salesEventId`
   - `start`
   - `end`
   - `limit`
3. The API key field is kept only in hook state.
4. When the user clicks the API load action, the hook's `loadApi` calls
   `loadSalesAnalyticsExport`.
5. `loadSalesAnalyticsExport` calls `fetchSalesAnalyticsExport`.
6. `fetchSalesAnalyticsExport`:
   - builds `GET /analytics/export?salesEventId=&start=&end=&limit=`
   - sends `Accept: application/json`
   - sends `X-API-Key` when the user provided one
   - rejects non-2xx responses with status-specific error codes
   - rejects payloads that do not use `schemaVersion:
     sales-analytics-export.v1`
7. On success:
   - the hook replaces the current document with the API payload
   - source becomes `api`
   - the header shows API-local status text
8. On failure:
   - `loadSalesAnalyticsExport` returns the local fixture
   - source becomes `fixture`
   - the hook maps the error code to translated feedback rendered by Home

### Persistence

The hook saves non-secret filter changes through `salesApi.ts`; API keys remain
in memory. See [browser persistence](integrations.md#browser-persistence) for
keys, fields and failure behavior.

### Error handling

- `400`: invalid analytics export filters
- `401`: missing API key
- `403`: role without permission for analytics export
- Network or unknown failures: generic API-load failure message
- Invalid schema: explicit `sales-analytics-export.v1` schema error

### External integration

- Optional local HTTP API:

```text
GET /analytics/export?salesEventId=&start=&end=&limit=
```

- Default frontend base URL: `/api`
- Vite proxy target: `http://localhost:8080`
- Expected backend project: `sales-event-project`

### Mermaid

```mermaid
flowchart TD
  A[Home mounts] --> B[Load local fixture]
  A --> C[Load saved non-secret filters]
  D[User clicks Carregar API] --> E[loadSalesAnalyticsExport]
  E --> F[fetchSalesAnalyticsExport]
  F --> G{HTTP 2xx and schema v1?}
  G -- Yes --> H[Use API document]
  H --> I[Show API local source]
  G -- No --> J[Use local fixture]
  J --> K[Show fallback or error message]
```

### Files involved

- [src/pages/home/Home.tsx](../src/pages/home/Home.tsx)
- [useSalesAnalytics.ts](../src/pages/home/hooks/useSalesAnalytics.ts)
- [src/analytics/api.ts](../src/analytics/api.ts)
- [src/analytics/fixtures.ts](../src/analytics/fixtures.ts)
- [src/config/salesApi.ts](../src/config/salesApi.ts)
- [vite.config.js](../vite.config.js)

## Flow 4: analytics transformation and rendering

### Confirmed entry point

- [src/pages/home/Home.tsx](../src/pages/home/Home.tsx)

### Confirmed execution path

1. `Home` receives either the local fixture or API document.
2. Pure transformers in
   [src/analytics/transformers.ts](../src/analytics/transformers.ts)
   derive:
   - KPI values
   - default `5m` time-series points
   - event table rows
   - funnel rows
   - survival summary rows
3. `Home` passes prepared data to page-level components:
   - `KpiGrid`
   - `AnalyticsCharts`
   - `InsightPanels`
   - `EventsTable`
   - `ExportPanel`
4. CSV rows are built on demand by the export hook rather than on every render.
5. Empty or missing funnel/survival blocks render empty states rather than
   throwing.

### Error handling

- Empty analytics documents return zeros and empty arrays from transformers.
- Missing optional funnel/survival analyses render empty UI states.

### Files involved

- [src/analytics/transformers.ts](../src/analytics/transformers.ts)
- [src/pages/home/components/KpiGrid.tsx](../src/pages/home/components/KpiGrid.tsx)
- [src/pages/home/components/AnalyticsCharts.tsx](../src/pages/home/components/AnalyticsCharts.tsx)
- [src/pages/home/components/InsightPanels.tsx](../src/pages/home/components/InsightPanels.tsx)
- [src/pages/home/components/EventsTable.tsx](../src/pages/home/components/EventsTable.tsx)

## Flow 5: browser-side analytics exports

### Confirmed entry point

- [src/pages/home/components/ExportPanel.tsx](../src/pages/home/components/ExportPanel.tsx)

### Confirmed execution path

1. `ExportPanel` exposes actions for:
   - raw JSON
   - events CSV
   - windows CSV
   - events-by-window PNG
   - event-types PNG
2. `useAnalyticsExports` supplies download actions, chart references and
   translated success/error feedback. JSON export serializes the active document.
3. CSV exports build rows on demand with analytics transformers and download
   them through shared utilities.
4. PNG export finds the visible chart SVG, renders it to a canvas and downloads
   an image blob.
5. File names are built from the active document `generatedAt` date and a
   deterministic suffix.

### Error handling

- CSV/PNG actions are disabled when their corresponding dataset is empty.
- PNG export shows a user-facing message when the chart SVG, image loading or
  canvas blob generation fails.

### Files involved

- [src/pages/home/Home.tsx](../src/pages/home/Home.tsx)
- [src/pages/home/components/ExportPanel.tsx](../src/pages/home/components/ExportPanel.tsx)
- [useAnalyticsExports.ts](../src/pages/home/hooks/useAnalyticsExports.ts)
- [utils/download.ts](../src/utils/download.ts)
- [src/analytics/exporters.ts](../src/analytics/exporters.ts)

## Flow 6: users grid local delete behavior

### Confirmed entry point

- [src/components/datatable/Datatable.tsx](../src/components/datatable/Datatable.tsx)

### Confirmed execution path

1. Component initializes local state with `userRows`.
2. `DataGrid` renders rows and columns.
3. Action column exposes:
   - a “View” link
   - a “Delete” action
4. Clicking Delete calls `handleDelete(id)`.
5. `handleDelete` filters the local `data` state.
6. Grid rerenders without the removed row.

### Validations

- No validation beyond row id existence in local array.

### Persistence

- None

### External integration

- None

### Error handling

- No explicit error handling.

### Files involved

- [src/components/datatable/Datatable.tsx](../src/components/datatable/Datatable.tsx)
- [src/datatablesource.tsx](../src/datatablesource.tsx)

## Flow 7: metadata-driven form rendering with image preview

### Confirmed entry point

- [src/pages/new/New.tsx](../src/pages/new/New.tsx)

This is currently a legacy component and is not wired into the active
analytics route tree.

### Confirmed execution path

1. A caller passes `inputs` and `title` props.
2. `New` stores selected file in local component state.
3. If a file is selected, preview uses `URL.createObjectURL(file)`.
4. If no file is selected, preview uses a fallback image URL.
5. Input fields are rendered by iterating over the provided metadata array.
6. Submit button is present, but there is no explicit React submit handler or persistence logic.
7. Because the form uses the browser default submit behavior, any resulting navigation/reload depends on the current browser environment and URL handling.

### Validation

- No runtime validation logic observed in source.

### Persistence

- None

### External integration

- None

### Files involved

- [src/pages/new/New.tsx](../src/pages/new/New.tsx)
- [src/formSource.ts](../src/formSource.ts)

## Flow 8: theme switching

### Confirmed entry points

- Sidebar Light button
- Sidebar Dark button
- Navbar toggle button

### Confirmed execution path

1. UI dispatches `LIGHT`, `DARK` or `TOGGLE`.
2. `darkModeReducer` returns new `darkMode` state.
3. `App` applies `app dark` or `app` root class.
4. CSS variables and themed selectors from [src/style/dark.scss](../src/style/dark.scss) affect rendering.

### Files involved

- [src/components/sidebar/Sidebar.tsx](../src/components/sidebar/Sidebar.tsx)
- [src/components/navbar/Navbar.tsx](../src/components/navbar/Navbar.tsx)
- [src/context/darkModeContext.tsx](../src/context/darkModeContext.tsx)
- [src/context/darkModeReducer.ts](../src/context/darkModeReducer.ts)
- [src/style/dark.scss](../src/style/dark.scss)
