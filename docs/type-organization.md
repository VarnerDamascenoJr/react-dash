# Type Organization

Each context has one `<context>.types.ts` file for its interfaces, aliases,
component props and local state contracts. Keep that file in the owning feature
or module. There is no project-wide `src/types.ts` collection or separate type
file for each technical layer within a context.

## Ownership Map

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

## Interfaces And Aliases

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

## Local Types And Legacy Code

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

Run the normal frontend checks after a type refactor. `npm run typecheck` also
checks the `expectTypeOf` assertions in `chart.types.test.ts`, including invalid
metric names and mismatched numeric/textual fields. `npm test` alone transpiles
TypeScript and does not replace compiler validation.

Official references:

- [TypeScript modules and type-only imports](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [TypeScript mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
