import type {} from 'i18next';
import type { resources } from './resources';
import type { supportedLanguages } from './preferences';

export type AppLanguage = (typeof supportedLanguages)[number];

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'home';
    resources: typeof resources['pt-BR'];
  }
}
