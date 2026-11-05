# Demo Checklist

This checklist prepares `react-dash` for a local demo and portfolio handoff. It
covers the reproducible fixture path and the integrated path with the local
`sales-event-project` API.

## Demo Goal

Show that operational Sales events can become an explorable and exportable
analytics dataset:

- collection and production KPIs;
- windowed time series;
- event type distribution;
- raw events table;
- JSON, CSV, and PNG exports;
- local fallback when the API is not available yet.

## Pre-check

In `react-dash`:

```bash
git status --short --branch
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
git diff --check
```

Expected result:

- clean working tree before the demo;
- tests passing;
- typecheck passing;
- build passing;
- only the known large bundle warning may appear during the build.

## Fixture Demo

1. Start the app:

```bash
npm start
```

2. Open:

```text
http://localhost:5173
```

3. Sign in with the demo credentials documented in `.env.example`.
4. Confirm that the home page shows `Dados de demonstração` as the source.
5. Verify:
   - event, sales, revenue, ticket, and check-in KPIs;
   - events by window chart;
   - event type chart;
   - funnel and survival blocks with an empty state when absent;
   - raw events table.
6. Export:
   - `JSON completo`;
   - `CSV de eventos`;
   - `CSV de janelas`;
   - `PNG de janelas`;
   - `PNG de tipos de evento`.

## Local Sales API Demo

Dependency:

```text
GET /analytics/export?salesEventId=&start=&end=&limit=
```

Steps:

1. In `sales-event-project`, start the local stack.
2. Still in `sales-event-project`, generate rich analytics data:

```bash
scripts/generate-analytics-demo-data.sh --sales 50 --reset-demo-inventory
```

   The script creates sales, approved/failed payments, email events, and
   check-ins for the seeded local event.
3. Make sure the Sales API is available at:

```text
http://localhost:8080
```

4. In `react-dash`, use:

```env
VITE_SALES_API_BASE_URL=/api
```

5. Start the app:

```bash
npm start
```

6. Fill in the dashboard:
   - `URL base`: `/api` with the Vite proxy, or the absolute API URL;
   - `Evento de vendas`: local event UUID;
   - `Início`: RFC3339 lower bound when filtering by period;
   - `Fim`: RFC3339 upper bound when filtering by period;
   - `Limite`: event limit;
   - `Chave da API`: `dev-support-key` for the seeded local `sales-event-project`
     stack, or another key with the `SUPPORT` or `ADMIN` role.
7. Click `Carregar API`.
8. Confirm that the source changes to `API do Sales`.
9. Repeat the JSON, CSV, and PNG exports.
10. Run the local API E2E path:

```bash
SALES_SUPPORT_API_KEY=dev-support-key npm run test:e2e
```

11. Capture visual evidence:

```bash
SALES_SUPPORT_API_KEY=dev-support-key npm run evidence:sales-api
```

    The evidence command captures desktop full-page, events table, funnel,
    dark-theme full-page, and mobile full-page PNGs. Use `EVIDENCE_OUTPUT_DIR`
    to choose a different output directory.

The dashboard may remember `URL base`, `Evento de vendas`, `Início`, `Fim`, and
`Limite` in the browser. The `Chave da API` must not be persisted.

## Expected Fallback

When the API does not exist, is down, or returns an error:

- the dashboard must keep rendering the local fixture;
- the source must remain on or return to `Dados de demonstração`;
- the message must explain the failure in a readable way;
- no screen should break.

## Portfolio Evidence

During review or recording:

- capture the home screen with KPIs and charts;
- keep one exported JSON file;
- keep both CSV files;
- keep the generated evidence PNGs;
- record whether the source used was `Dados de demonstração` or `API do Sales`.

## Done Criteria

The demo is ready when:

- the app runs locally;
- the fixture opens without external services;
- the local API works when the Sales endpoint is available;
- exports generate readable files;
- validation commands pass;
- a new agent can follow this document without reading the source code.

## Language Smoke

The default language is Portuguese. Switch to English from the login or dashboard
selector and confirm labels, feedback, number/date formatting and Data Grid
pagination update. Reload to confirm the preference is restored. API keys stay
in memory, and JSON/CSV exports keep their original contract field names.
