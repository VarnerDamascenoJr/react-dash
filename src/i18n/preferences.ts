export const languageStorageKey = 'react-dash.language';
export const supportedLanguages = ['pt-BR', 'en-US'] as const;
export type AppLanguage = (typeof supportedLanguages)[number];

export function resolveLanguage(language?: string | null): AppLanguage {
  return language === 'en-US' || language === 'en' ? 'en-US' : 'pt-BR';
}

export function loadLanguage(): AppLanguage {
  try {
    return resolveLanguage(window.localStorage.getItem(languageStorageKey));
  } catch (_error) {
    return 'pt-BR';
  }
}

export function saveLanguage(language: AppLanguage) {
  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch (_error) {
    // Language switching remains available when browser storage is restricted.
  }
}
