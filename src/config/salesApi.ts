import type { SalesAnalyticsSettings } from './salesApi.types';
import { readStoredJson, writeStoredJson } from '../utils/storage';

export const salesApiBaseUrl =
  import.meta.env.VITE_SALES_API_BASE_URL?.trim() || '/api';

export const salesAnalyticsSettingsStorageKey = 'react-dash.analytics.settings';
export const defaultSalesAnalyticsLimit = 2000;

export function defaultSalesAnalyticsSettings(
  defaultSalesEventId = ''
): SalesAnalyticsSettings {
  return {
    baseUrl: salesApiBaseUrl,
    end: '',
    limit: defaultSalesAnalyticsLimit,
    salesEventId: defaultSalesEventId,
    start: '',
  };
}

export function loadSalesAnalyticsSettings(
  defaultSalesEventId = ''
): SalesAnalyticsSettings {
  const defaults = defaultSalesAnalyticsSettings(defaultSalesEventId);

  const parsed = readStoredJson(salesAnalyticsSettingsStorageKey);
  if (parsed && typeof parsed === 'object') {
    const settings = parsed as Partial<SalesAnalyticsSettings>;
    return {
      baseUrl:
        typeof settings.baseUrl === 'string' ? settings.baseUrl : defaults.baseUrl,
      end: typeof settings.end === 'string' ? settings.end : defaults.end,
      limit: normalizeLimit(settings.limit, defaults.limit),
      salesEventId:
        typeof settings.salesEventId === 'string'
          ? settings.salesEventId
          : defaults.salesEventId,
      start: typeof settings.start === 'string' ? settings.start : defaults.start,
    };
  }
  return defaults;
}

export function saveSalesAnalyticsSettings(settings: SalesAnalyticsSettings) {
  writeStoredJson(salesAnalyticsSettingsStorageKey, {
    baseUrl: settings.baseUrl,
    end: settings.end,
    limit: settings.limit,
    salesEventId: settings.salesEventId,
    start: settings.start,
  });
}

function normalizeLimit(value: unknown, fallback: number) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) {
    return fallback;
  }

  return Math.floor(value);
}
