# Analytics Dashboard Backlog

This is the active follow-up list for `react-dash`. Current product concepts
belong in [domain](domain.md), implementation structure in
[architecture](architecture.md), and required checks in the
[validation policy](testing.md#validation-policy).

The [historical planning snapshot](archive/analytics-dashboard-history.md)
preserves RD0-RD5, the original CFX1-CFX9 reports and their acceptance criteria.
It is not a current task-status authority. Backend findings below need evidence
from `sales-event-project`; this documentation refactor does not certify their
resolution or authorize changes in that repository.

## Current Baseline

The local source includes the analytics contract and fixture, pure transformers,
optional API loading with fallback, JSON/CSV/PNG exports, modular Home and login
hooks, MUI sections, shared UI/utilities and Portuguese/English localization.
Desktop/mobile browser tests cover fixture navigation, intercepted API loads,
exports, fallback, auth, language and theme behavior.

The original RD0-RD5 plan is retained for context. Its old statements that the
API UI is unwired or that translations are only a text dictionary should not
be used to infer current work. A fresh real-stack rehearsal remains separate
from the deterministic browser test suite.

## Frontend Follow-ups

### CFX5 - Reproducible Live API Evidence

- Implemented: `npm run evidence:sales-api` captures desktop, event-table,
  funnel, dark-theme and mobile views. It accepts the configured base URL,
  event ID, API key and output directory, clears the key before screenshots,
  and disables traces/videos for the integration and evidence specs.
- Existing coverage: baseline browser tests intercept API responses and cover
  the shared evidence loading helper, filters/header and key persistence.
  The real Sales API test skips without `SALES_SUPPORT_API_KEY`; evidence
  capture is excluded from the baseline suite by its `@evidence` tag.
- Remaining verification: run the live-stack rehearsal and screenshot command
  from the [demo checklist](demo-checklist.md) when the Sales stack is configured.
  Confirm non-empty output and keep generated evidence outside tracked files.
  Unit and intercepted browser tests alone do not certify that deployment.
- Original details: [CFX5](archive/analytics-dashboard-history.md#cfx5---automatizar-evidencias-visuais-da-api-local).

### CFX6 - Verify Clean Playwright Setup

- Existing setup: `test:e2e:install` installs the managed Chromium version;
  [testing](testing.md#browser-setup) documents clean setup, optional browser
  storage location and Vite server reuse.
- Remaining verification: reproduce install and E2E execution in a clean
  environment; do not infer that from an existing browser cache.
- Completion evidence: a successful clean-machine run without a hardcoded
  browser executable. A doctor script is optional, not an existing command.
- Original details: [CFX6](archive/analytics-dashboard-history.md#cfx6---tornar-playwright-local-reprodutivel).

### CFX7 - Reduce Chart Test Warnings

- Recheck the Recharts/JSDOM warnings described in
  [testing](testing.md#known-warnings) before making changes.
- If still reproducible, provide stable dimensions or focused chart mocks
  while retaining real-browser chart coverage. Do not hide unrelated warnings.
- Completion evidence: unit tests without repetitive dimension warnings and
  passing browser chart checks.
- Original details: [CFX7](archive/analytics-dashboard-history.md#cfx7---reduzir-ruido-de-recharts-nos-testes-unitarios).

### CFX8 - Show Recent Events First

- Verify the table's current initial order before changing it.
- Set a deliberate newest-first visual order, preserve manual column sorting,
  and keep raw JSON/CSV order independent unless a contract change is intended.
- Completion evidence: focused component/transformer and browser assertions
  for initial order, plus explicit export-order expectations.
- Original details: [CFX8](archive/analytics-dashboard-history.md#cfx8---mostrar-dados-mais-recentes-na-tabela-analitica-por-padrao).

## Cross-repository Verification

These are rehearsal findings and partially documented follow-ups, not claims
that the backend defects remain present. Verify them in their owning repository
before assigning implementation work.

| ID | Owner | Evidence needed to close |
| --- | --- | --- |
| CFX1 | `sales-event-project` | Large analytics exports serialize finite numbers and do not fail with NaN/Inf. |
| CFX2 | `sales-event-project` | JSON encoding failures return an error response rather than an empty `200`. |
| CFX3 | Both repositories | Documented development key and roles agree with the actual local seed. React docs currently use the same seeded example. |
| CFX4 | `sales-event-project` | The documented `generate-analytics-demo-data.sh` produces the required demo events reproducibly. |
| CFX9 | Both repositories | The documented inventory reset is explicit, limited to known demo data and repeatable without manual SQL. |

Original reports:
[CFX1](archive/analytics-dashboard-history.md#cfx1---corrigir-nan-no-export-analitico-grande-do-sales),
[CFX2](archive/analytics-dashboard-history.md#cfx2---fazer-a-api-nao-responder-200-vazio-em-falha-de-json),
[CFX3](archive/analytics-dashboard-history.md#cfx3---unificar-chaves-demo-documentadas-e-seeds-locais),
[CFX4](archive/analytics-dashboard-history.md#cfx4---criar-script-versionado-para-massa-de-dados-de-demo),
[CFX9](archive/analytics-dashboard-history.md#cfx9---isolar-estado-de-demo-entre-execucoes).

## Product Boundaries

Keep fixture-first behavior, the `sales-analytics-export.v1` contract, optional
Sales API access and browser-side exports. The domain navigation can continue
to target sections of the single dashboard route; dedicated screens require
an actual product need.

Production authentication, PDF reports, backend schema changes, direct
observability-system ingestion and automatic statistical conclusions beyond
the contract are outside this backlog's current scope. Legacy user/product
screens are not the active analytics product.

## Closing Work

Follow the [validation policy](testing.md#validation-policy) for frontend
changes and the owning repository's instructions for backend changes. Use the
[demo checklist](demo-checklist.md) for real-stack rehearsal. Record the date,
observed result and relevant evidence when closing a follow-up; preserve
historical details in the archive rather than copying old plans into active
instructions.
