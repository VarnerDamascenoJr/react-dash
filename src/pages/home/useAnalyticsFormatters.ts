import { useTranslation } from 'react-i18next';
import { resolveLanguage } from '../../i18n/preferences';
import { getFormatters } from '../../utils/formatters';

export function useAnalyticsFormatters() {
  const { i18n } = useTranslation();
  const locale = resolveLanguage(i18n.resolvedLanguage);
  return getFormatters(locale);
}
