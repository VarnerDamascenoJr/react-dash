import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveLanguage } from '../../i18n/preferences';
import { createAnalyticsFormatters } from './formatters';

export function useAnalyticsFormatters() {
  const { i18n } = useTranslation();
  const locale = resolveLanguage(i18n.resolvedLanguage);
  return useMemo(() => createAnalyticsFormatters(locale), [locale]);
}
