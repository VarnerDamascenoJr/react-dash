# Integrations And Browser Storage

The dashboard uses a versioned local fixture by default and can load the
`sales-event-project` analytics API on demand. There is no backend, database,
ORM or migration layer in this repository.

## Sales Analytics API

- Client: [src/analytics/api.ts](../src/analytics/api.ts).
- Configuration: [src/config/salesApi.ts](../src/config/salesApi.ts).
- Loading and fallback UI: [useSalesAnalytics](../src/pages/home/hooks/useSalesAnalytics.ts).
- Default frontend base URL: `/api`.
- Local Vite proxy target: `http://localhost:8080`.

```text
GET /analytics/export?salesEventId=&start=&end=&limit=
```

The client sends `Accept: application/json` and `X-API-Key` when a key is
provided. The backend must allow an appropriate `SUPPORT` or `ADMIN` key and
return the `sales-analytics-export.v1` schema. The response includes events,
windows, funnels and survival data.

Invalid filters, missing/forbidden keys, network failures and invalid response
schemas become stable error codes translated by the UI. Failed loads return
the local fixture without breaking the dashboard. See [flows](flows.md) for
the request path and [the demo checklist](demo-checklist.md) for a live local
stack run. Baseline browser tests intercept API requests and do not prove that
a separate Sales deployment is healthy.

Real keys must stay outside tracked files and the React bundle. Enter a key
in the dashboard for the current session. The documented seeded local demo
key is an example for that development stack, not a production credential.

## Browser Persistence

All persistence uses browser `localStorage`; it is not a trusted server session
or a database. These keys have different owners and failure behavior:

| Key | Stored value | Owner |
| --- | --- | --- |
| `react-dash.auth.user` | Serialized demo user: name, role, email and avatar | [authContext.tsx](../src/context/authContext.tsx) |
| `react-dash.analytics.settings` | Non-secret `baseUrl`, `salesEventId`, `start`, `end` and `limit` | [salesApi.ts](../src/config/salesApi.ts) |
| `react-dash.language` | Selected language code | [preferences.ts](../src/i18n/preferences.ts) |

Analytics settings and language preferences use
[safe storage helpers](../src/utils/storage.ts). Missing, malformed or blocked
preference storage falls back to defaults; language changes can still work in
memory. Analytics limits are normalized to positive integers.

Authentication currently accesses `localStorage` and parses its JSON directly.
Malformed session JSON or blocked storage can therefore disrupt authentication
initialization or login/logout. Stored users are client-controlled, so this demo
mechanism does not establish production authorization.

API keys, passwords and analytics documents are not persisted by these flows.
API keys remain in the mounted loading hook and are cleared when that state is
recreated. Loaded documents, loading state and export feedback stay in memory.
Theme state is held in React Context rather than persisted by the theme reducer.

## Dates, Language And Exports

[Localization](localization.md) owns translation catalogs and locale selection.
Shared `Intl` formatters display dates in the browser timezone and keep amounts
in BRL; switching language changes formatting without converting currency.
Stored date filters are request bounds, not a separate date database.

Browser downloads use Blob/object URLs through
[utils/download.ts](../src/utils/download.ts). Analytics-specific filenames and
PNG error codes remain in [exporters.ts](../src/analytics/exporters.ts). PNG
exports also depend on SVG/image loading and canvas support. Export failures
become user-facing feedback. JSON and CSV keep the data contract field names.

The legacy New page also creates object URLs for image previews. Its form and
the legacy user grid have no backend persistence: deleting a row changes only
component state and does not survive a reload.

## UI Libraries

| Library | Active use |
| --- | --- |
| MUI Core | Login, navigation, panels, forms and other shared controls |
| MUI Data Grid | Analytics events table; also used by the legacy user grid |
| Recharts | Shared analytics charts and the legacy revenue chart |
| i18next / react-i18next | Bundled, typed translation resources and language switching |
| `react-circular-progressbar` | Legacy featured summary card |

Recharts depends on real container dimensions; JSDOM warnings and bundle-size
warnings are covered in [testing](testing.md#known-warnings).

## Environment Configuration

The browser-visible configuration variables are:

- `VITE_DEMO_LOGIN_EMAIL`
- `VITE_DEMO_LOGIN_PASSWORD`
- `VITE_DEMO_USER_NAME`
- `VITE_DEMO_USER_ROLE`
- `VITE_DEMO_USER_AVATAR`
- `VITE_SALES_API_BASE_URL`

Definitions live in [auth.ts](../src/config/auth.ts),
[salesApi.ts](../src/config/salesApi.ts) and
[vite-env.d.ts](../src/vite-env.d.ts). See [.env.example](../.env.example) and
the [project README](../README.md) for local setup. All `VITE_*` values ship
to the browser; they are unsuitable for private provider or production secrets.

The app uses browser `fetch`, with no GraphQL/gRPC client, message broker,
observability vendor SDK or payment/email service SDK. Deployment-specific
configuration and hosting are not defined here.
