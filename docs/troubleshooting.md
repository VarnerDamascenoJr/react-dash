# Troubleshooting

## General

This project is a frontend-only React/Vite analytics dashboard with demo auth,
a versioned local `sales-analytics-export.v1` fixture and an optional local
Sales API integration. Many apparent “business problems” can still be fixture,
client-state or API availability limitations rather than server bugs.

## Common situations

### I cannot access dashboard routes

**Confirmed checks**

- Protected routes require an authenticated client session.
- If `AuthContext` reports `isAuthenticated = false`, routes redirect to `/login`.

**Inspect**

- [src/components/auth/ProtectedRoute.tsx](../src/components/auth/ProtectedRoute.tsx)
- [src/context/authContext.tsx](../src/context/authContext.tsx)
- [src/config/auth.ts](../src/config/auth.ts)

**Likely causes**

- `localStorage` does not contain the demo user
- entered credentials do not match demo configuration
- environment variables changed demo values unexpectedly

### Login page redirects away immediately

**Confirmed cause**

- `PublicOnlyRoute` redirects authenticated users from `/login` to `/`.

**Inspect**

- [src/components/auth/PublicOnlyRoute.tsx](../src/components/auth/PublicOnlyRoute.tsx)

### Delete in users grid does not persist

**Confirmed cause**

- Delete only mutates React local state in `Datatable`.

**Inspect**

- [src/components/datatable/Datatable.tsx](../src/components/datatable/Datatable.tsx)

### Form submit does nothing

**Confirmed cause**

- `New` page renders a form UI but no persistence or explicit React submit handler is implemented.

**Inspect**

- [src/pages/new/New.tsx](../src/pages/new/New.tsx)

**Important detail**

- Because the form still uses the browser default submit behavior, you may see a page reload or same-route submission behavior instead of a saved record.

### Tests warn about chart dimensions

**Confirmed cause**

- Recharts renders inside JSDOM without real layout dimensions.

**Inspect**

- [Known test warnings](testing.md#known-warnings)
- `ResizeObserver` is mocked in [src/setupTests.ts](../src/setupTests.ts), but
  container sizing remains artificial

### Build warns about large chunks

**Confirmed cause**

- Vite build emits a large bundle warning.

See [known warnings](testing.md#known-warnings). Check the current build output
before assuming an earlier bundle-size observation still applies.

**Likely contributing factors**

- MUI
- Data Grid
- Recharts
- no route-level code splitting currently present

## Operational unknowns

- Deployment process is not documented in repository files.
- [CI](../.github/workflows/ci.yml) runs the automated checks described in
  [testing](testing.md#continuous-integration). Inspect failed-job logs and
  browser failure artifacts, and reproduce the relevant checks locally.

## Validation

Follow the [validation policy](testing.md#validation-policy) for required
checks. Report commands actually run for the current task; historical analysis
notes do not establish that the current checkout passes.
