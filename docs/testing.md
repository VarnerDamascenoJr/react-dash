# Testing

## Validation Policy

This is the authoritative validation policy for developers and AI assistants.
Other documents and local skills refer here instead of defining a separate
baseline. Required checks depend on the change:

### Documentation And Agent Guidance Only

```bash
npm run check:docs
git diff --check
```

Check changed Markdown links and references to moved documents. When modifying
a skill, validate its frontmatter and confirm its referenced documents exist.
Application test suites are not required when only documentation or agent
instructions change.

### Code, Tests Or Application Configuration

Run the full existing baseline for every code change, including refactors:

```bash
npm run lint
npm test
npm run typecheck
npm run check:docs
npm run build
npm run test:e2e
git diff --check
```

Build and E2E checks are required for all code changes, not only selected UI
surfaces. Focused tests are useful during development but do not replace this
baseline before handoff.

Additional checks:

- For frontend styles, layout, Sass/CSS, MUI sizing or responsive changes, run
  `npm run check:style-units`.
- For localization changes, also run `npm run lint` and
  `npm run check:style-units`, preserving the localization workflow's checks.
- Before opening a PR or presenting the demo, run the full baseline and
  `npm run check:style-units`, even when style changes were not part of the task.
- A live Sales API change also needs the relevant integration smoke from the
  [demo checklist](demo-checklist.md); intercepted browser requests do not
  validate a running backend.

If a required command fails, investigate and fix an in-scope cause. If a check
cannot run because of an environment limit, report the command and reason;
do not describe the result as passing. At handoff, list commands actually run,
their outcomes, and any known warnings separately from failures.

## Strategy

The project uses two complementary test layers:

- Vitest for pure analytics logic, API-client behavior and React component
  smoke tests in JSDOM.
- Playwright for browser-level flows that demonstrate the portfolio app as a
  user would experience it.

The baseline E2E path must stay deterministic and use the local fixture. The
Sales API can be covered by separate integration smoke checks, but ordinary E2E
tests should not require external services.

Add or update regression tests for behavior changed by implementation work.
Use Vitest for pure logic, API-client behavior and component assertions; use
Playwright for route guards, auth, exports and other browser-dependent flows.
Prefer role, label and accessible-name selectors over CSS selectors.

## Tooling

### Confirmed

- Unit/component runner: Vitest
- DOM environment: JSDOM
- Assertion helpers: `@testing-library/jest-dom`
- Rendering utilities: `@testing-library/react`
- Browser E2E runner: Playwright
- E2E local server: Playwright `webServer` starts Vite automatically
- Documentation links: `npm run check:docs`, with regression coverage in
  [check-doc-links.test.js](../scripts/check-doc-links.test.js) included by Vitest

## Continuous Integration

[GitHub Actions](../.github/workflows/ci.yml) runs on pull requests and pushes
to `main`, using Node.js 22. It installs dependencies, then runs lint, type
checking, unit/tooling tests, documentation links, style units, diff whitespace,
the production build and desktop/mobile Playwright tests. Checkout fetches full
Git history so the style check can compare against `origin/main`.

CI installs the managed Chromium browser and its Linux system dependencies
with `npm run test:e2e:install -- --with-deps`. Browser tests run with one
worker for predictable resource use, with retries and reporting controlled by
the existing Playwright configuration. On failure, available browser reports,
traces and screenshots are uploaded with seven-day retention.

This follows [Playwright's CI installation guidance](https://playwright.dev/docs/ci#github-actions).
Local execution of the same checks verifies the commands; a hosted workflow
run is required to verify the GitHub runner environment itself.

## Configuration Evidence

- [package.json](../package.json)
- [vite.config.js](../vite.config.js)
- [playwright.config.ts](../playwright.config.ts)
- [src/setupTests.ts](../src/setupTests.ts)

## Test Organization

### Confirmed files

- [src/App.test.tsx](../src/App.test.tsx)
- [src/analytics/api.test.ts](../src/analytics/api.test.ts)
- [src/analytics/exporters.test.ts](../src/analytics/exporters.test.ts)
- [src/analytics/transformers.test.ts](../src/analytics/transformers.test.ts)
- [src/pages/new/New.test.tsx](../src/pages/new/New.test.tsx)
- [tests/e2e/analytics-dashboard.spec.ts](../tests/e2e/analytics-dashboard.spec.ts)

### Pattern

- Tests for pure analytics behavior stay near `src/analytics`.
- Component smoke tests stay near app/page code under `src`.
- Browser E2E tests live under `tests/e2e`.
- Playwright tests prefer role, label and accessible-name locators over CSS
  selectors.

## Current Coverage Shape

### Covered areas

- Root app render under authenticated state.
- Analytics API URL building, API-key header behavior and fallback behavior.
- Analytics transformers for KPIs, windows, rows and empty documents.
- CSV serialization and export filename generation.
- Shared metric lists and empty states, formatter instance reuse, generic
  JSON/CSV/Blob downloads, and malformed or blocked preference storage.
- Legacy `New` page form field rendering.
- Login form validation, pending submission locking, translated feedback,
  retry after failure and complete return destinations. Redirect unit tests
  cover malformed state, external destinations and login loops.
- Protected login-to-dashboard flow with fixture data in a real browser.
- Browser-level auth behavior for invalid login, protected-route redirects,
  public-login redirects for authenticated users and logout/session cleanup.
- Browser-level required login fields, recovery after invalid credentials and
  preservation of protected query parameters and fragments.
- Browser-level theme switching from the navbar action and sidebar segmented
  controls.

### API, Exports And Mobile Coverage

- [analytics-dashboard.spec.ts](../tests/e2e/analytics-dashboard.spec.ts) already
  covers successful intercepted API loads, JSON/CSV/PNG downloads, failure
  fallback, non-secret settings restoration and API-key clearing after reload.
- [localization.spec.ts](../tests/e2e/localization.spec.ts) checks translated
  feedback and downloads while preserving data and current filters.
- Playwright runs the suite against desktop Chromium and mobile Chrome device
  profiles; dashboard checks include horizontal-overflow assertions.

These tests use local fixtures and intercepted API responses. A real-stack
Sales rehearsal and repeatable screenshot capture remain separate follow-ups
in the [active backlog](analytics-dashboard-backlog.md).

## Playwright Configuration

The project follows current Playwright practices:

- `baseURL` is set globally, so tests can navigate with relative paths.
- `webServer` starts the Vite dev server automatically.
- retries are enabled only in CI.
- traces are collected on first retry.
- screenshots are retained only on failure.
- videos are retained only on failure.
- HTML reporting is enabled in CI, with list output for terminal readability.
- the browser matrix is intentionally scoped to Chromium desktop and mobile
  Chrome as a fast portfolio baseline.

`REACT_DASH_BASE_URL` can point to an already running app; in that mode,
Playwright does not start Vite. The default remains `http://127.0.0.1:5173`.

### Optional Sales API checks

The baseline command excludes tests tagged `@evidence`. It covers the shared
evidence loading helper with an intercepted API response, including the request
filters/header and clearing the in-memory key without persisting it.

The real API test in `sales-api.spec.ts` skips unless `SALES_SUPPORT_API_KEY` is
set. To use it, start and seed `sales-event-project` first:

```bash
SALES_SUPPORT_API_KEY=dev-support-key npm run test:e2e
SALES_SUPPORT_API_KEY=dev-support-key npm run evidence:sales-api
```

`SALES_EVENT_ID` overrides the seeded event UUID. `EVIDENCE_OUTPUT_DIR` overrides
the default `evidence/sales-api-dashboard` output directory. Evidence uses
Portuguese labels and clears the API key before taking screenshots. The API
integration and evidence specs disable traces and videos, which could otherwise
retain credentials. PNG output under `evidence/` is ignored by Git.

## Browser Setup

From the repository root on a fresh machine:

```bash
npm ci
npm run test:e2e:install
npm run test:e2e
```

The install script downloads the Chromium version managed by the installed
Playwright package, covering both configured device profiles. Rerun it after
a Playwright version update; do not pin a personal browser-cache executable.

If a separate browser storage location is needed, set `PLAYWRIGHT_BROWSERS_PATH`
consistently for both installation and test execution, for example:

```bash
PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/react-dash-playwright" npm run test:e2e:install
PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/react-dash-playwright" npm run test:e2e
```

Outside CI, `reuseExistingServer` allows an existing Vite server at the configured
`http://127.0.0.1:5173` URL. Otherwise Playwright starts it automatically; in CI
server reuse is disabled. Close an unrelated process on that port before running.

## Interactive Checks

Use the [validation policy](#validation-policy) for required checks. To inspect
browser tests interactively:

```bash
npm run test:e2e:ui
```

## Frontend Style Units

New frontend style changes should use `rem` instead of `px` for spacing,
sizing, borders, radii and breakpoints. `npm run check:style-units` checks added
lines in `src` against the merge base with `origin/main`, plus staged and
unstaged local changes.

Use `STYLE_UNITS_BASE=<ref> npm run check:style-units` to compare against a
different base ref. If a browser or library API explicitly requires pixels, keep
the exception local and add `px-ok` with a short reason.

Single E2E target:

```bash
npx playwright test tests/e2e/analytics-dashboard.spec.ts
```

## Known Warnings

- `App.test.tsx` can produce a Recharts warning in JSDOM because chart
  container width and height resolve to 0 in the artificial DOM.
- `npm run build` can warn about large chunks because MUI, MUI Data Grid and
  Recharts are bundled into the app.

## Sources

- Official Playwright best practices: https://playwright.dev/docs/best-practices
- Official Playwright web server configuration: https://playwright.dev/docs/test-webserver
- Official Playwright trace guidance: https://playwright.dev/docs/trace-viewer
