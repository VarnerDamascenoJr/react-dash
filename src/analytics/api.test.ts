import { vi } from 'vitest';
import {
  SalesAnalyticsApiError,
  buildAnalyticsExportUrl,
  fetchSalesAnalyticsExport,
  loadSalesAnalyticsExport,
} from './api';
import { localSalesAnalyticsFixture } from './fixtures';

describe('sales analytics API client', () => {
  it('builds the analytics export URL with filters', () => {
    const url = buildAnalyticsExportUrl(
      {
        salesEventId: 'event-1',
        start: '2026-09-01T00:00:00Z',
        end: '2026-09-02T00:00:00Z',
        limit: 500,
      },
      '/api/'
    );

    expect(url).toBe(
      '/api/analytics/export?salesEventId=event-1&start=2026-09-01T00%3A00%3A00Z&end=2026-09-02T00%3A00%3A00Z&limit=500'
    );
  });

  it('fetches the export and sends the API key header', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const headers = init?.headers as Headers;
      expect(headers.get('X-API-Key')).toBe('support-key');

      return new Response(JSON.stringify(localSalesAnalyticsFixture), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      });
    });

    const document = await fetchSalesAnalyticsExport(
      { salesEventId: 'event-1' },
      { apiKey: ' support-key ', baseUrl: '/api', fetcher }
    );

    expect(document.schemaVersion).toBe('sales-analytics-export.v1');
    expect(fetcher).toHaveBeenCalledWith(
      '/api/analytics/export?salesEventId=event-1',
      expect.objectContaining({ headers: expect.any(Headers) })
    );
  });

  it('throws a friendly unauthorized error', async () => {
    const fetcher = vi.fn(async () => new Response('{}', { status: 401 }));

    await expect(
      fetchSalesAnalyticsExport({}, { baseUrl: '/api', fetcher })
    ).rejects.toMatchObject({
      message: 'API key obrigatoria para carregar dados do Sales.',
      status: 401,
    });
  });

  it('throws when the response schema is not the analytics export', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ schemaVersion: 'unknown' }), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        })
    );

    await expect(
      fetchSalesAnalyticsExport({}, { baseUrl: '/api', fetcher })
    ).rejects.toBeInstanceOf(SalesAnalyticsApiError);
  });

  it('falls back to the local fixture when the API fails', async () => {
    const fetcher = vi.fn(async () => new Response('{}', { status: 403 }));

    const result = await loadSalesAnalyticsExport({}, { baseUrl: '/api', fetcher });

    expect(result.source).toBe('fixture');
    expect(result.document).toBe(localSalesAnalyticsFixture);
    expect(result.error).toMatchObject({
      message: 'A API key nao possui permissao para o export analitico.',
      status: 403,
    });
  });
});
