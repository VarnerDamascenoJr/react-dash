# Localization

The active login and dashboard support `pt-BR` and `en-US` through `i18next`
and `react-i18next`. Portuguese is the default and fallback language. Choose a
language from the labeled selector on login or in the dashboard header.

## Catalogs

Translations live in `src/i18n/locales/<language>/` with three namespaces:

- `home.json`: analytics sections, controls, empty states and feedback.
- `shell.json`: navigation, header and language selector.
- `login.json`: demo sign-in and authentication feedback.

Use `useTranslation('home')` (or the relevant namespace) inside React components
and hooks. Keys are checked against the Portuguese resources by TypeScript.
The module augmentation lives in `src/i18n/i18n.types.ts`, separate from runtime
resource registration.
`strictNullChecks` is enabled as required by the i18next typed API.
Keep matching, non-empty keys in both languages; the catalog tests check this.

Translate complete sentences and interpolate values, such as
`t('header.generated', { service, date })`. Use the `count` option and plural
suffixes for counts; zero events has an explicit `_zero` entry. Portuguese also
includes `_many`, used for counts such as one million.

The catalogs ship with the bundle and initialize synchronously. No translation
service, external account, credentials or network requests are required.

## Language Preference And Formatting

Only the language code is stored under `react-dash.language`. Unsupported saved
values fall back to Portuguese. Blocked browser storage does not prevent language
switching in memory. The document `lang` attribute follows the active language.

`useAnalyticsFormatters` selects the shared `Intl` instances cached by locale in
`src/utils/formatters.ts`. Mounted sections reuse the same instances.
Dates retain their instant and browser timezone. Amounts remain in BRL:
changing locale changes the display, without converting the underlying currency.

The Data Grid uses its official v6 locale packs, including pagination and column
menus. Column labels and cell formatting update without resetting page filters,
the in-memory API key or the loaded analytics document.

## Feedback And Data Boundaries

Load and export hooks retain results or feedback codes rather than translated
sentences, so existing feedback updates when the language changes. API and PNG
errors expose stable codes that the UI maps to translated messages; their
diagnostic messages remain available on the error objects. The API client and
exporters do not depend on the translation system.

Contract fields, event identifiers, provider values and JSON/CSV data remain
unchanged. PNGs capture the chart in the current language. Legacy pages outside
the active route tree are outside this localization scope.

## Validation

- `npm test`: catalog parity, fallback, interpolation, pluralization, storage,
  locale formatting and feedback changes without repeating API calls/downloads.
- `npm run test:e2e`: login and dashboard language switching, restoration after
  reload, official grid translations, API fallback, exports and mobile overflow.
- Also run lint, typecheck, style units, build and `git diff --check`.

## Official References

- [React i18next hooks](https://react.i18next.com/latest/usetranslation-hook)
- [i18next configuration](https://www.i18next.com/overview/configuration-options)
- [i18next TypeScript](https://www.i18next.com/overview/typescript)
- [i18next plurals](https://www.i18next.com/translation-function/plurals)
- [MUI Data Grid v6 localization](https://v6.mui.com/x/react-data-grid/localization/)
