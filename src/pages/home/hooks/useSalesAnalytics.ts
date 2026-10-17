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
import { homeCopy } from '../copy';

export function useSalesAnalytics() {
  const [settings, setSettings] = useState(() =>
    loadSalesAnalyticsSettings(localSalesAnalyticsFixture.source.salesEventId ?? '')
  );
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState<
    SalesAnalyticsLoadResult & { loadMessage: string }
  >({
    document: localSalesAnalyticsFixture,
    source: 'fixture',
    loadMessage: homeCopy.loadStatus.fixture,
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
      setLoaded({
        ...result,
        loadMessage:
          result.source === 'api'
            ? homeCopy.loadStatus.api
            : result.error?.message ?? homeCopy.loadStatus.fallback,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    document: loaded.document,
    source: loaded.source,
    loadMessage: loaded.loadMessage,
    settings,
    updateSettings,
    apiKey,
    setApiKey,
    isLoading,
    loadApi,
  };
}
