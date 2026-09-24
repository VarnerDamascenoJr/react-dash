import { salesApiBaseUrl } from '../config/salesApi';
import { localSalesAnalyticsFixture } from './fixtures';
import type { SalesAnalyticsDocument } from './types';

export interface SalesAnalyticsExportFilters {
  salesEventId?: string;
  start?: string;
  end?: string;
  limit?: number;
}

export interface SalesAnalyticsClientOptions {
  apiKey?: string;
  baseUrl?: string;
  fetcher?: typeof fetch;
}

export interface SalesAnalyticsLoadOptions
  extends SalesAnalyticsClientOptions {
  fallbackDocument?: SalesAnalyticsDocument;
}

export interface SalesAnalyticsLoadResult {
  document: SalesAnalyticsDocument;
  source: 'api' | 'fixture';
  error?: SalesAnalyticsApiError;
}

export class SalesAnalyticsApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'SalesAnalyticsApiError';
    this.status = status;
  }
}

export function buildAnalyticsExportUrl(
  filters: SalesAnalyticsExportFilters = {},
  baseUrl = salesApiBaseUrl
) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const url = new URL(`${normalizedBaseUrl}/analytics/export`, window.location.origin);

  appendQueryParam(url, 'salesEventId', filters.salesEventId);
  appendQueryParam(url, 'start', filters.start);
  appendQueryParam(url, 'end', filters.end);
  if (filters.limit !== undefined) {
    appendQueryParam(url, 'limit', String(filters.limit));
  }

  if (isAbsoluteUrl(normalizedBaseUrl)) {
    return url.toString();
  }

  return `${url.pathname}${url.search}`;
}

export async function fetchSalesAnalyticsExport(
  filters: SalesAnalyticsExportFilters = {},
  options: SalesAnalyticsClientOptions = {}
): Promise<SalesAnalyticsDocument> {
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(buildAnalyticsExportUrl(filters, options.baseUrl), {
    headers: buildHeaders(options.apiKey),
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  const payload = await response.json();
  if (!isSalesAnalyticsDocument(payload)) {
    throw new SalesAnalyticsApiError(
      'A resposta da API nao usa o schema sales-analytics-export.v1.'
    );
  }

  return payload;
}

export async function loadSalesAnalyticsExport(
  filters: SalesAnalyticsExportFilters = {},
  options: SalesAnalyticsLoadOptions = {}
): Promise<SalesAnalyticsLoadResult> {
  try {
    return {
      document: await fetchSalesAnalyticsExport(filters, options),
      source: 'api',
    };
  } catch (error) {
    return {
      document: options.fallbackDocument ?? localSalesAnalyticsFixture,
      source: 'fixture',
      error:
        error instanceof SalesAnalyticsApiError
          ? error
          : new SalesAnalyticsApiError('Nao foi possivel carregar a API local.'),
    };
  }
}

function normalizeBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.trim() || '/api';
  return trimmed.replace(/\/+$/, '');
}

function appendQueryParam(url: URL, key: string, value?: string) {
  if (value && value.trim() !== '') {
    url.searchParams.set(key, value.trim());
  }
}

function buildHeaders(apiKey?: string) {
  const headers = new Headers({
    accept: 'application/json',
  });

  if (apiKey?.trim()) {
    headers.set('X-API-Key', apiKey.trim());
  }

  return headers;
}

async function toApiError(response: Response) {
  const fallback = errorMessageForStatus(response.status);

  try {
    const body = await response.json();
    if (body && typeof body.error === 'string' && body.error.trim()) {
      return new SalesAnalyticsApiError(body.error, response.status);
    }
  } catch (_error) {
    return new SalesAnalyticsApiError(fallback, response.status);
  }

  return new SalesAnalyticsApiError(fallback, response.status);
}

function errorMessageForStatus(status: number) {
  switch (status) {
    case 400:
      return 'Filtros invalidos para o export analitico.';
    case 401:
      return 'API key obrigatoria para carregar dados do Sales.';
    case 403:
      return 'A API key nao possui permissao para o export analitico.';
    default:
      return 'Nao foi possivel carregar o export analitico do Sales.';
  }
}

function isSalesAnalyticsDocument(value: unknown): value is SalesAnalyticsDocument {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SalesAnalyticsDocument>;
  return (
    candidate.schemaVersion === 'sales-analytics-export.v1' &&
    Array.isArray(candidate.events) &&
    Array.isArray(candidate.windows) &&
    Boolean(candidate.summary) &&
    Boolean(candidate.source)
  );
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//.test(value);
}
