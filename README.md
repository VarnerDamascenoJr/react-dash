# React Dash

Analytics dashboard in React for viewing and exporting operational data from
`sales-event-project`.

The app presents the `sales-analytics-export.v1` contract as a portfolio-ready
experience: KPIs, windowed time series, event distribution, analytics table, and
JSON, CSV, and PNG exports. It works first with a local fixture and is also ready
to consume the local Sales API when the `GET /analytics/export` endpoint is
available.

## Stack

- React 18
- TypeScript
- Vite
- Vitest
- Playwright
- MUI
- Recharts
- Sass

## Scripts

From the project directory, you can run:

### `npm start`

Starts the development environment with Vite.

By default, the app is available at `http://localhost:5173`.

### `npm run build`

Builds the production bundle in `dist/`.

### `npm test`

Runs the test suite with Vitest.

### `npm run test:e2e`

Runs the E2E tests with Playwright. Playwright starts the Vite server
automatically and validates the protected dashboard flow in a real browser.

### `npm run test:e2e:install`

Installs the Chromium browser used by the local/CI E2E baseline.

### `npm run typecheck`

Runs TypeScript type checking without emitting files.

### `npm run check:style-units`

Validates that new frontend lines in `src` do not introduce `px` units. New
styles should use `rem` by default; explicit exceptions can use the `px-ok`
marker when a browser API or library requires pixels.

### `npm run preview`

Serves the generated build locally for a quick validation pass.

## Local Configuration

Copy `.env.example` to `.env.local` when you want to override the demo defaults.

Available variables:

- `VITE_DEMO_LOGIN_EMAIL`: email accepted by the demo login.
- `VITE_DEMO_LOGIN_PASSWORD`: password accepted by the demo login.
- `VITE_DEMO_USER_NAME`: name shown in the authenticated shell.
- `VITE_DEMO_USER_ROLE`: role shown in the authenticated shell.
- `VITE_DEMO_USER_AVATAR`: avatar shown in the authenticated shell.
- `VITE_SALES_API_BASE_URL`: Sales API base URL. The recommended default is
  `/api`, using the Vite proxy to `http://localhost:8080`.

Real API key values must not be stored in versioned files. For the seeded local
`sales-event-project` stack, enter `dev-support-key` in the dashboard when
loading the local API. In other environments, use a key with the `SUPPORT` or
`ADMIN` role.

## Fixture Flow

1. Install dependencies:

```bash
npm ci
```

2. Start the app:

```bash
npm start
```

3. Open `http://localhost:5173`.
4. Sign in with the demo credentials configured in `.env.example`.
5. The home page loads the local fixture
   `src/analytics/fixtures/sales-analytics-export.v1.json` by default.
6. Validate KPIs, charts, table, and JSON, CSV, and PNG exports.

## Local Sales API Flow

Expected dependency in `sales-event-project`:

```text
GET /analytics/export?salesEventId=&start=&end=&limit=
```

Expected contract:

- authenticate with the `X-API-Key` header;
- allow the `SUPPORT` and `ADMIN` roles;
- return `schemaVersion: sales-analytics-export.v1`;
- preserve events, windows, funnels, and survival analytics in the export.

Recommended local run:

1. Start the `sales-event-project` stack, including API, database, and workers.
2. In the `sales-event-project` repo, generate sales, payment, email/ticket, and
   check-in events:

```bash
scripts/generate-analytics-demo-data.sh --sales 50 --reset-demo-inventory
```

3. Start `react-dash` with `VITE_SALES_API_BASE_URL=/api`.
4. Confirm or adjust the `Base URL` field; the default value is `/api`.
5. Fill in `Sales event`, `Start`, `End`, and `Limit` according to the local
   demo.
6. Enter `dev-support-key` in the `API key` field for the seeded local
   `sales-event-project` stack, or another valid key with the `SUPPORT` or
   `ADMIN` role.
7. Click `Load API`.
8. If the API fails or does not exist yet, the dashboard falls back to the local
   fixture and shows the fallback message.

The dashboard persists only non-secret settings, such as `Base URL` and filters.
The `API key` value stays only in page memory.

## Validation

Before opening a PR or using the demo in a portfolio:

```bash
npm test
npm run typecheck
npm run check:style-units
npm run build
npm run test:e2e
git diff --check
```

## Structure

- `src/components`: reusable dashboard components
- `src/pages`: main pages
- `src/context`: simple global theme state
- `src/types.ts`: shared types
- `src/analytics`: types, fixture, client, transformers, and exporters for the
  `sales-analytics-export.v1` contract
- `docs/analytics-dashboard-backlog.md`: backlog and product contract for
  turning the app into the Sales Event analytics dashboard
- `docs/demo-checklist.md`: smoke checklist for the local demo and portfolio
- `docs/agentic`: agent-agnostic capabilities, React expert skills, and the
  local Graphify flow

## Suggested Next Steps

- Follow `docs/demo-checklist.md` before recording or presenting the demo.
- Implement the `GET /analytics/export` endpoint in `sales-event-project` to
  replace the fallback with real data.
- Keep the local fixture as a reproducible path for tests and handoff.
