export const salesApiBaseUrl =
  import.meta.env.VITE_SALES_API_BASE_URL?.trim() || '/api';

export const salesAnalyticsSettingsStorageKey = 'react-dash.analytics.settings';
export const defaultSalesAnalyticsLimit = 2000;

export interface SalesAnalyticsSettings {
  baseUrl: string;
  salesEventId: string;
  start: string;
  end: string;
  limit: number;
}

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

  if (typeof window === 'undefined') {
    return defaults;
  }

  try {
    const rawSettings = window.localStorage.getItem(
      salesAnalyticsSettingsStorageKey
    );
    if (!rawSettings) {
      return defaults;
    }

    const parsed = JSON.parse(rawSettings) as Partial<SalesAnalyticsSettings>;
    return {
      baseUrl:
        typeof parsed.baseUrl === 'string' ? parsed.baseUrl : defaults.baseUrl,
      end: typeof parsed.end === 'string' ? parsed.end : defaults.end,
      limit: normalizeLimit(parsed.limit, defaults.limit),
      salesEventId:
        typeof parsed.salesEventId === 'string'
          ? parsed.salesEventId
          : defaults.salesEventId,
      start: typeof parsed.start === 'string' ? parsed.start : defaults.start,
    };
  } catch (_error) {
    return defaults;
  }
}

export function saveSalesAnalyticsSettings(settings: SalesAnalyticsSettings) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      salesAnalyticsSettingsStorageKey,
      JSON.stringify({
        baseUrl: settings.baseUrl,
        end: settings.end,
        limit: settings.limit,
        salesEventId: settings.salesEventId,
        start: settings.start,
      })
    );
  } catch (_error) {
    // Storage can be unavailable in restricted browser modes; the UI still works in memory.
  }
}

function normalizeLimit(value: unknown, fallback: number) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) {
    return fallback;
  }

  return Math.floor(value);
}
