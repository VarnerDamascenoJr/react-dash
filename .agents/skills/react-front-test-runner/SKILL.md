---
name: react-front-test-runner
description: Run the required frontend validation flow after any React frontend implementation task, including changes to components, routes, styles, state, tests, build config, dependencies, or browser-facing behavior.
---

# React Front Test Runner

Use this skill for every React frontend implementation task. It applies after
code or configuration edits that affect browser-facing behavior, React
components, routes, state, styles, tests, build tooling, assets, or frontend
dependencies.

## Required Baseline

Before finishing any frontend implementation, run:

```bash
npm run typecheck
npm test
git diff --check
```

If a command fails, investigate and fix the cause when it is in scope. Do not
hide failures. If a command cannot be run because of environment limits, report
the exact command and reason.

## Additional Checks

Run the relevant extra checks based on the touched surface:

- Style, layout, Sass, CSS, MUI sizing, or responsive UI changes:

```bash
npm run check:style-units
```

- Route guards, auth flow, navigation, dashboard workflows, exports, or any
  user-visible flow:

```bash
npm run test:e2e
```

- Vite config, TypeScript config, package changes, dependency changes, import
  behavior, build output, or production-facing rendering:

```bash
npm run build
```

## Test Selection

- Prefer focused tests while developing, but run the required baseline before
  the final response.
- Add or update Vitest tests for pure analytics logic, API-client behavior,
  component smoke coverage, and regression cases that can be asserted in JSDOM.
- Add or update Playwright tests for protected routes, auth behavior,
  user-visible dashboard flows, exports, and browser-only behavior.
- Keep E2E tests fixture-first and independent from the Sales API.
- Prefer role, label, and accessible-name selectors over CSS selectors.

## Handoff

In the final response, include the commands run and their result. Mention known
warnings separately from failures.
