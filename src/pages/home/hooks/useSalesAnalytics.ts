import { useEffect, useState } from 'react';
import {
  loadSalesAnalyticsExport,
  localSalesAnalyticsFixture,
  type SalesAnalyticsLoadResult,
} from '../../../analytics';
import {
  loadSalesAnalyticsSettings,
  saveSalesAnalyticsSettings,
  type SalesAnalyticsSettings,
} from '../../../config/salesApi';
import { useTranslation } from 'react-i18next';

export function useSalesAnalytics() {
  const { t } = useTranslation('home');
  const [settings, setSettings] = useState(() =>
    loadSalesAnalyticsSettings(localSalesAnalyticsFixture.source.salesEventId ?? '')
  );
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState<SalesAnalyticsLoadResult>({
    document: localSalesAnalyticsFixture,
    source: 'fixture',
  });

  useEffect(() => {
    saveSalesAnalyticsSettings(settings);
  }, [settings]);

  const updateSettings = (changes: Partial<SalesAnalyticsSettings>) => {
    setSettings((current) => ({ ...current, ...changes }));
  };

  const loadApi = async () => {
    setIsLoading(true);
    try {
      const { baseUrl, ...filters } = settings;
      const result = await loadSalesAnalyticsExport(filters, { apiKey, baseUrl });
      setLoaded(result);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    document: loaded.document,
    source: loaded.source,
    loadMessage: loaded.error
      ? t('loadStatus.fallbackReason', { reason: t(`apiErrors.${loaded.error.code}`) })
      : t(loaded.source === 'api' ? 'loadStatus.api' : 'loadStatus.fixture'),
    settings,
    updateSettings,
    apiKey,
    setApiKey,
    isLoading,
    loadApi,
  };
}
