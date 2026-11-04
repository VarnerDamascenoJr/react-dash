import type { AppLanguage } from './i18n.types';
import { readStoredValue, writeStoredValue } from '../utils/storage';

export const languageStorageKey = 'react-dash.language';
export const supportedLanguages = ['pt-BR', 'en-US'] as const;

export function resolveLanguage(language?: string | null): AppLanguage {
  return language === 'en-US' || language === 'en' ? 'en-US' : 'pt-BR';
}

export function loadLanguage(): AppLanguage {
  return resolveLanguage(readStoredValue(languageStorageKey));
}

export function saveLanguage(language: AppLanguage) {
  writeStoredValue(languageStorageKey, language);
}
