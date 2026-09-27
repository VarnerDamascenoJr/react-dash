# Testing

## Strategy

The project uses two complementary test layers:

- Vitest for pure analytics logic, API-client behavior and React component
  smoke tests in JSDOM.
- Playwright for browser-level flows that demonstrate the portfolio app as a
  user would experience it.

The baseline E2E path must stay deterministic and use the local fixture. The
Sales API can be covered by separate integration smoke checks, but ordinary E2E
tests should not require external services.

## Tooling

### Confirmed

- Unit/component runner: Vitest
- DOM environment: JSDOM
- Assertion helpers: `@testing-library/jest-dom`
- Rendering utilities: `@testing-library/react`
- Browser E2E runner: Playwright
- E2E local server: Playwright `webServer` starts Vite automatically

### Evidence

- [package.json](/home/varner/aprendizagem/projetos/react-dash/package.json:1)
- [vite.config.js](/home/varner/aprendizagem/projetos/react-dash/vite.config.js:1)
- [playwright.config.ts](/home/varner/aprendizagem/projetos/react-dash/playwright.config.ts:1)
- [src/setupTests.ts](/home/varner/aprendizagem/projetos/react-dash/src/setupTests.ts:1)

## Test Organization

### Confirmed files

- [src/App.test.tsx](/home/varner/aprendizagem/projetos/react-dash/src/App.test.tsx:1)
- [src/analytics/api.test.ts](/home/varner/aprendizagem/projetos/react-dash/src/analytics/api.test.ts:1)
- [src/analytics/exporters.test.ts](/home/varner/aprendizagem/projetos/react-dash/src/analytics/exporters.test.ts:1)
- [src/analytics/transformers.test.ts](/home/varner/aprendizagem/projetos/react-dash/src/analytics/transformers.test.ts:1)
- [src/pages/new/New.test.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/new/New.test.tsx:1)
- [tests/e2e/analytics-dashboard.spec.ts](/home/varner/aprendizagem/projetos/react-dash/tests/e2e/analytics-dashboard.spec.ts:1)

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
- Legacy `New` page form field rendering.
- Protected login-to-dashboard flow with fixture data in a real browser.
- Browser-level auth behavior for invalid login, protected-route redirects,
  public-login redirects for authenticated users and logout/session cleanup.

### Recommended next targets

- Theme switching behavior.
- API-load failure state in browser.
- Export download behavior in browser.
- Mobile dashboard smoke viewport.

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

Install browsers when setting up a fresh machine:

```bash
npx playwright install
```

For the configured baseline only:

```bash
npm run test:e2e:install
```

## Commands

```bash
npm test
npm run check:style-units
npm run test:e2e
npm run test:e2e:ui
npm run typecheck
npm run build
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
