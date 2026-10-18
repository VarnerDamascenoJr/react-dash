# Shared Components And Utilities

Reusable UI belongs in `src/components/common`. Shared functions without React
state belong in `src/utils`. Keep components and functions tied to a single
feature in that feature. Prefer an existing MUI control over a wrapper that only
renames its props.

The review covered the active login, shell, analytics sections, exports,
formatters and preference persistence. Graphify identified consumers; source
inspection confirmed the shared responsibilities before extraction.

## Consolidated UI

| Component | Reuse |
| --- | --- |
| `Brand` | Login and sidebar share the mark/name layout; each supplies its subtitle and local styling |
| `LanguageSelector` | Login and navbar use the same selector and language preference |
| `TooltipIconButton` | Navbar actions use one label for the tooltip and accessible button name |
| `SectionPanel` | Charts, event table, funnel and survival share the panel header and metric display |
| `PageIntro` | Legacy List page introduction with caller-supplied eyebrow, title and description; preserves the global `pageIntro` styles |
| `MetricList` / `EmptyState` | Funnel and survival share row rendering and empty states; callers prepare labels and formatted values |
| `charts/ChartPanel`, `TimeSeriesAreaChart`, `VerticalDistributionBarChart` | Generic chart contracts and presentation live outside Home |

Common UI props live in `common.types.ts`; chart props and the data-key helper
live in `charts/charts.types.ts`. Common styles travel with the components.
Panel selectors account for MUI's generated styles so their surface, spacing
and responsive header remain consistent outside Home.
Import components directly from their owning files.

## Consolidated Functions

| Module | Responsibility |
| --- | --- |
| `utils/formatters.ts` | Reuse one set of `Intl` instances per locale across mounted sections; currency remains BRL |
| `utils/csv.ts` / `csv.types.ts` | Generic CSV serialization and its value contracts |
| `utils/download.ts` | JSON/CSV downloads and the Blob/object-URL download lifecycle shared with PNG exports |
| `utils/storage.ts` | Safe string/JSON access for optional browser preferences |

`useAnalyticsFormatters` binds the active language to the shared formatter
cache. It does not create a separate set per section. The supported language
resolver currently supplies `pt-BR` and `en-US`.

Storage helpers report unavailable reads as `null` and failed writes as `false`.
Callers still validate values, select persistable fields and choose fallbacks.
Language and non-secret analytics settings use these helpers. Authentication
retains its session-storage behavior. API keys remain in memory.

## Context Boundaries

Sales transformers, fixture/API fallback, export filenames, PNG error codes,
login feedback and login redirect rules remain in their owning contexts. These
functions carry product policy; placing them in a global utility file would
couple unrelated consumers to that policy.

The older, non-routed List page composes `PageIntro` and `Datatable`. New and
Single still render their introductions inline and can adopt `PageIntro` when
those pages are revisited. Their mock data and differing chart axes are not
part of the shared analytics components.

## Validation

Use the normal frontend checks and the existing desktop/mobile E2E suite.
Regression tests cover shared metric rows and empty states, formatter reuse,
CSV content, download cleanup, malformed or blocked preference storage, and
analytics settings fallback. Existing tests protect login, language switching,
theme controls, fixture/API loading and JSON/CSV/PNG exports.
