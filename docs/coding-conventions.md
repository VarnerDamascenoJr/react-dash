# Coding Conventions

This document owns shared-code placement, context boundaries and TypeScript
type conventions. Feature behavior belongs in the relevant domain or flow
reference; required checks belong in the [validation policy](testing.md#validation-policy).

## Shared Components And Utilities

Reusable UI belongs in `src/components/common`. Shared functions without React
state belong in `src/utils`. Keep components and functions tied to a single
feature in that feature. Prefer an existing MUI control over a wrapper that only
renames its props.

### Consolidated UI

| Component | Reuse |
| --- | --- |
| `Brand` | Login and sidebar share the mark/name layout; each supplies its subtitle and local styling |
| `LanguageSelector` | Login and navbar use the same selector and language preference |
| `TooltipIconButton` | Navbar actions use one label for the tooltip and accessible button name |
| `SectionPanel` | Charts, event table, funnel and survival share the panel header and metric display |
| `PageIntro` | Legacy List page introduction with caller-supplied eyebrow, title and description; preserves the global `pageIntro` styles |
| `MetricList` / `EmptyState` | Funnel and survival share row rendering and empty states; callers prepare labels and formatted values |
| `charts/ChartPanel`, `TimeSeriesAreaChart`, `VerticalDistributionBarChart` | Generic chart contracts and presentation live outside Home |

Shared UI is organized by responsibility. Each context keeps its components,
types, styles and existing tests together:

| Directory | Components | Types |
| --- | --- | --- |
| `common/branding/` | `Brand` | `branding.types.ts` |
| `common/controls/` | `LanguageSelector`, `TooltipIconButton` | `controls.types.ts` |
| `common/feedback/` | `EmptyState` | `feedback.types.ts` |
| `common/layout/` | `PageIntro`, `SectionPanel` | `layout.types.ts` |
| `common/data-display/` | `MetricList` | `dataDisplay.types.ts` |
| `common/charts/` | `ChartPanel`, `TimeSeriesAreaChart`, `VerticalDistributionBarChart` | `charts.types.ts` |

Styles are imported by their owning components, without a shared `common.scss`.
`PageIntro` retains the global header styles in `src/index.css`, also used by
the inline introductions in legacy New and Single pages.
Panel selectors account for MUI's generated styles so their surface, spacing
and responsive header remain consistent outside Home.
Import components directly from their owning files, such as
`components/common/layout/SectionPanel`.

### Consolidated Functions

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
retains its direct `localStorage` access. API keys remain in memory.

### Context Boundaries

Sales transformers, fixture/API fallback, export filenames, PNG error codes,
login feedback and login redirect rules remain in their owning contexts. These
functions carry product policy; placing them in a global utility file would
couple unrelated consumers to that policy.

The older, non-routed List page composes `PageIntro` and `Datatable`. New and
Single still render their introductions inline and can adopt `PageIntro` when
those pages are revisited. Their mock data and differing chart axes are not
part of the shared analytics components.

## Type Organization

Each context has one `<context>.types.ts` file for its interfaces, aliases,
component props and local state contracts. Keep that file in the owning feature
or module. There is no project-wide `src/types.ts` collection or separate type
file for each technical layer within a context.

### Ownership Map

| Location | Responsibility |
| --- | --- |
| `src/analytics/analytics.types.ts` | Export document, API loading, view models, CSV records and error codes |
| `src/pages/home/home.types.ts` | Home sections and export feedback |
| `src/auth/auth.types.ts` | User, credentials, authentication context and provider props |
| `src/context/darkMode.types.ts` | Theme state, actions, context and provider props |
| `src/config/salesApi.types.ts` | Persisted non-secret analytics configuration |
| `src/i18n/i18n.types.ts` | Language alias and i18next resource augmentation |
| `src/components/sidebar/sidebar.types.ts` | Navigation items and section/entry props |
| `src/pages/login/login.types.ts` | Login feedback and form props; credentials reuse the auth contract |
| `src/components/common/branding/branding.types.ts` | Brand props |
| `src/components/common/controls/controls.types.ts` | Labeled icon action props |
| `src/components/common/feedback/feedback.types.ts` | Empty state props |
| `src/components/common/layout/layout.types.ts` | Page introduction and section panel props |
| `src/components/common/data-display/dataDisplay.types.ts` | Metric list items and props |
| `src/components/common/charts/charts.types.ts` | Generic chart props and data-key helper |
| `src/utils/csv.types.ts` | Generic CSV value and row contracts |

Consumers outside analytics import its public types from `src/analytics/index.ts`.
Type modules do not import runtime implementations. In particular, load failures
use the structural `SalesAnalyticsApiFailure` contract, implemented by the
`SalesAnalyticsApiError` class. Code can still use the class for `instanceof`.

### Interfaces And Aliases

- Use `interface` for named object contracts, including component props.
- Use `type` for unions, mapped types, tuples and other type expressions.
- Use descriptive names rather than `I` prefixes or a separate global
  `interfaces` directory.
- Import types with `import type` or a `type` specifier in a mixed import.
- Prefer inference for implementation details and hook return values. Add a
  named type when it is shared, documents a boundary or constrains valid input.
- Derive a type from a constant when the constant is its source of truth;
  `AppLanguage` in `i18n.types.ts` uses `typeof supportedLanguages` through a
  type-only import, keeping the union synchronized with the supported values.

The wire document, UI view models and CSV rows remain distinct definitions
inside `analytics.types.ts`: the transformers flatten nested data and replace
optional values with display
or export defaults. Similar property names do not make these contracts identical.
Persisted settings also remain separate from optional API query parameters.

### Local Types And Legacy Code

Component files import their props from the context's type file. For example,
Home sections use `home.types.ts`; they do not each require a
separate type file. Shared charts own `charts.types.ts` under `common/charts`.
`ChartDataKey` in that file restricts keys to fields of the
expected value type, and chart props infer the data shape from their series.
Other shared UI contexts follow the same pattern under `common/branding`,
`common/controls`, `common/feedback`, `common/layout` and `common/data-display`.

Legacy form definitions live in `src/pages/new/new.types.ts`; legacy user rows
live in `src/components/datatable/datatable.types.ts`. Widget definitions live in
`src/components/widgets/widget.types.ts`, and the legacy chart props live in
`src/components/chart/chart.types.ts`. These contexts stay outside the active
analytics API.

## Validation

Follow the [validation policy](testing.md#validation-policy) after code changes.
The existing suites cover shared UI, formatter reuse, CSV content, download
cleanup, blocked or malformed preference storage, and fixture/API behavior.
`npm run typecheck` also checks the `expectTypeOf` assertions in
`chart.types.test.ts`, including invalid metric names and mismatched value
kinds. Vitest transpilation does not replace compiler validation.

TypeScript references:

- [Modules and type-only imports](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
