# Domain

## Scope

### Confirmed facts

- The application presents itself as a Sales Event analytics dashboard.
- The main active route is the analytics overview at `/`.
- The main visible domain concepts in the active UI are:
  - collected operational events
  - completed sales
  - observed revenue
  - issued tickets
  - completed check-ins
  - event windows
  - event type distribution
  - conversion funnel summaries
  - survival/time-to-stage summaries
  - raw analytics event rows
  - JSON, CSV and PNG exports
- The active dashboard uses the `sales-analytics-export.v1` contract through a
  local fixture and an optional Sales API integration.
- Legacy users/products/admin concepts still exist in non-routed components and
  source files, but they are not the primary active product domain.

### Important limitation

The repository does not contain its own backend or database model. Its active
business contract is the external `sales-analytics-export.v1` document produced
by `sales-event-project`, plus client-side transformations for display and
export.

## Observable Domain Concepts

### Authentication session

**Confirmed**

- A user can log in through a demo login flow.
- A logged-in user has `name`, `role`, `email` and `avatar`.
- Session persistence is client-side via `localStorage`.

**Evidence**

- [src/auth/auth.types.ts](../src/auth/auth.types.ts)
- [src/context/authContext.tsx](../src/context/authContext.tsx)

### Theme mode

**Confirmed**

- The UI supports two explicit theme actions, `LIGHT` and `DARK`, plus a `TOGGLE`.
- Theme mode affects CSS variables and component styling.

**Evidence**

- [src/context/darkModeReducer.ts](../src/context/darkModeReducer.ts)
- [src/style/dark.scss](../src/style/dark.scss)

### Sales analytics document

**Confirmed**

- The active analytics document uses `schemaVersion:
  sales-analytics-export.v1`.
- It contains source metadata, summary counts, raw events, window aggregates,
  funnel segments and survival analyses.
- The dashboard can load this document from:
  - the local fixture
  - `GET /analytics/export` from `sales-event-project`

**Evidence**

- [src/analytics/analytics.types.ts](../src/analytics/analytics.types.ts)
- [src/analytics/fixtures.ts](../src/analytics/fixtures.ts)
- [src/analytics/api.ts](../src/analytics/api.ts)

### Analytics KPIs

**Confirmed**

- KPI values are derived from the active analytics document:
  - total events
  - completed sales
  - observed approved payment revenue
  - issued tickets
  - completed check-ins
- The transformer tolerates an empty document by returning zero values.

**Evidence**

- [src/analytics/transformers.ts](../src/analytics/transformers.ts)
- [src/pages/home/components/KpiGrid.tsx](../src/pages/home/components/KpiGrid.tsx)

### Analytics exports

**Confirmed**

- The active document can be exported as raw JSON.
- Event rows and window rows can be exported as CSV.
- Visible charts can be exported as PNG.
- Export filenames are deterministic from the analytics document date when
  `generatedAt` is available.

**Evidence**

- [src/analytics/exporters.ts](../src/analytics/exporters.ts)
- [src/pages/home/components/ExportPanel.tsx](../src/pages/home/components/ExportPanel.tsx)

## Legacy Admin Concepts

These concepts remain in source files for compatibility and possible future
cleanup, but they are not wired into the current analytics route tree.

### Users

**Confirmed**

- User rows expose:
  - `id`
  - `username`
  - `img`
  - `email`
  - `status`
  - `age`
- User statuses are limited to:
  - `active`
  - `passive`
  - `pending`

**Evidence**

- `UserRow` type in [datatable.types.ts](../src/components/datatable/datatable.types.ts)
- mock rows in [src/datatablesource.tsx](../src/datatablesource.tsx)

### Form-driven entity creation

**Confirmed**

- There are two field-definition groups:
  - `userInputs`
  - `productInputs`
- The “new” page renders inputs dynamically from metadata.

**Evidence**

- [src/formSource.ts](../src/formSource.ts)
- [src/pages/new/New.tsx](../src/pages/new/New.tsx)

### Legacy dashboard KPIs

**Confirmed**

- Home page widgets support four types:
  - `user`
  - `order`
  - `earnings`
  - `balance`
- Each widget has title, money flag, link label and icon.

**Evidence**

- [src/components/widgets/Widget.tsx](../src/components/widgets/Widget.tsx)

**Confirmed limitation**

- All widget values are hardcoded (`amount = 100`, `diff = 20`).

### Legacy revenue / spending visualization

**Confirmed**

- The chart uses six months of hardcoded revenue-like data.
- The single profile page presents a spending chart.

**Evidence**

- [src/components/chart/Chart.tsx](../src/components/chart/Chart.tsx)
- [src/pages/single/Single.tsx](../src/pages/single/Single.tsx)

## Observable Rules

### Rule 1: protected navigation requires an authenticated client session

- Module: auth / routing
- Evidence: [src/components/auth/ProtectedRoute.tsx](../src/components/auth/ProtectedRoute.tsx)
- Behavior:
  - if `isAuthenticated` is false, navigation is redirected to `/login`
- Status: confirmed fact

### Rule 2: authenticated users should not remain on the login page

- Module: auth / routing
- Evidence: [src/components/auth/PublicOnlyRoute.tsx](../src/components/auth/PublicOnlyRoute.tsx)
- Behavior:
  - if `isAuthenticated` is true, navigation to `/login` redirects to `/`
- Status: confirmed fact

### Rule 3: demo login requires a specific email/password pair

- Module: auth
- Evidence: [src/context/authContext.tsx](../src/context/authContext.tsx), [src/config/auth.ts](../src/config/auth.ts)
- Behavior:
  - login succeeds only when the normalized email matches the configured demo email and the password matches the configured demo password
- Exception:
  - invalid credentials throw `DemoAuthenticationError`, mapped by the login
    form to translated feedback
- Status: confirmed fact

### Rule 4: deleting a row in the users grid only affects local screen state

- Module: datatable
- Evidence: [src/components/datatable/Datatable.tsx](../src/components/datatable/Datatable.tsx)
- Behavior:
  - clicking Delete filters the local `data` array
- Status: confirmed fact

### Rule 5: form fields are driven by metadata instead of hardcoded JSX fields

- Module: new page / form metadata
- Evidence: [src/formSource.ts](../src/formSource.ts), [src/pages/new/New.tsx](../src/pages/new/New.tsx)
- Behavior:
  - field rendering iterates over the `inputs` prop
- Status: confirmed fact

### Rule 6: theme can be forced to light or dark from the sidebar and toggled from the navbar

- Module: theme
- Evidence: [src/components/sidebar/Sidebar.tsx](../src/components/sidebar/Sidebar.tsx), [src/components/navbar/Navbar.tsx](../src/components/navbar/Navbar.tsx)
- Status: confirmed fact

## Legacy Scope And Unknowns

The non-routed users/products/admin screens contain illustrative data, not a
backend user or product lifecycle. Their legacy earnings and balance cards do
not define the active dashboard's revenue metric. Current analytics KPIs are
derived from the Sales export contract by the transformers described above.

Demo profile roles are display data; this frontend has no production
authorization matrix. Real user lifecycle rules and backend authorization belong
to the relevant backend, not these legacy components.
